#!/usr/bin/env python3
"""Generate a compact ATT&CK dataset for the Cybity site.

Source: https://github.com/mitre-attack/attack-stix-data
Usage: python3 scripts/generate_attack_data.py /path/to/enterprise-attack.json
"""
import json, re, sys, datetime

SRC = sys.argv[1] if len(sys.argv) > 1 else "/tmp/opencode/attack.json"
OUT = "src/data/attack.json"

TACTIC_ORDER = [
    ("reconnaissance", "TA0043", "Reconnaissance", "Recon"),
    ("resource-development", "TA0042", "Resource Development", "Resource Dev"),
    ("initial-access", "TA0001", "Initial Access", "Initial Access"),
    ("execution", "TA0002", "Execution", "Execution"),
    ("persistence", "TA0003", "Persistence", "Persistence"),
    ("privilege-escalation", "TA0004", "Privilege Escalation", "Priv. Escalation"),
    ("stealth", "TA0005", "Stealth", "Stealth"),
    ("defense-impairment", "TA0112", "Defense Impairment", "Defense Impairment"),
    ("credential-access", "TA0006", "Credential Access", "Credential Access"),
    ("discovery", "TA0007", "Discovery", "Discovery"),
    ("lateral-movement", "TA0008", "Lateral Movement", "Lateral Movement"),
    ("collection", "TA0009", "Collection", "Collection"),
    ("command-and-control", "TA0011", "Command and Control", "Command & Control"),
    ("exfiltration", "TA0010", "Exfiltration", "Exfiltration"),
    ("impact", "TA0040", "Impact", "Impact"),
]

SERVICE_MAP = {
    "reconnaissance": ["adversary"],
    "resource-development": ["adversary", "red-team"],
    "initial-access": ["red-team", "appsec", "cloud", "ai"],
    "execution": ["red-team", "appsec", "ai"],
    "persistence": ["red-team", "cloud"],
    "privilege-escalation": ["red-team", "appsec", "cloud"],
    "stealth": ["red-team", "appsec"],
    "defense-impairment": ["red-team", "cloud"],
    "credential-access": ["red-team", "appsec", "cloud"],
    "discovery": ["appsec", "cloud", "ai"],
    "lateral-movement": ["red-team", "cloud"],
    "collection": ["appsec", "ai", "cloud"],
    "command-and-control": ["red-team", "ai"],
    "exfiltration": ["appsec", "ai", "cloud"],
    "impact": ["red-team", "ai", "cloud"],
}


def fnv1a(text: str) -> int:
    h = 2166136261
    for ch in text:
        h ^= ord(ch)
        h = (h * 16777619) & 0xFFFFFFFF
    return h


def clean(text: str, limit: int = 900) -> str:
    if not text:
        return ""
    text = re.sub(r"\(Citation:[^)]*\)", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    cut = text[:limit]
    end = max(cut.rfind(". "), cut.rfind("; "))
    if end > 400:
        cut = cut[: end + 1]
    else:
        cut = cut.rsplit(" ", 1)[0] + "…"
    return cut.strip()


def main() -> None:
    bundle = json.load(open(SRC))
    objs = bundle["objects"]
    collection = next(o for o in objs if o["type"] == "x-mitre-collection")
    tactics_meta = {
        o["x_mitre_shortname"]: o
        for o in objs
        if o["type"] == "x-mitre-tactic" and not o.get("revoked")
    }
    active = [
        o
        for o in objs
        if o["type"] == "attack-pattern"
        and not o.get("revoked")
        and not o.get("x_mitre_deprecated")
    ]
    top = [o for o in active if not o.get("x_mitre_is_subtechnique")]
    subs_by_parent: dict[str, list] = {}
    for o in active:
        if not o.get("x_mitre_is_subtechnique"):
            continue
        for ref in o.get("external_references", []):
            if ref.get("source_name") == "mitre-attack" and ref.get("external_id"):
                parent = ref["external_id"].split(".")[0]
                subs_by_parent.setdefault(parent, []).append(o)

    tactics = []
    for short, tid, name, label in TACTIC_ORDER:
        meta = tactics_meta.get(short, {})
        tactics.append(
            {
                "id": tid,
                "short": short,
                "name": name,
                "label": label,
                "description": clean(meta.get("description", ""), 260),
            }
        )

    techniques = []
    for o in top:
        refs = o.get("external_references", [])
        tid = next(
            (r.get("external_id") for r in refs if r.get("source_name") == "mitre-attack"),
            None,
        )
        if not tid:
            continue
        phases = [
            p["phase_name"]
            for p in o.get("kill_chain_phases", [])
            if p.get("kill_chain_name") == "mitre-attack"
        ]
        phases = [p for p in phases if p in dict((s, 1) for s, *_ in TACTIC_ORDER)]
        phases.sort(key=lambda p: [s for s, *_ in TACTIC_ORDER].index(p))
        subs = sorted(
            (
                {
                    "id": next(
                        (
                            r.get("external_id")
                            for r in s.get("external_references", [])
                            if r.get("source_name") == "mitre-attack"
                        ),
                        "",
                    ),
                    "name": s["name"],
                }
                for s in subs_by_parent.get(tid, [])
            ),
            key=lambda x: x["id"],
        )
        services = sorted(
            {svc for p in phases for svc in SERVICE_MAP.get(p, [])}
        )
        heat = min(
            97,
            24
            + len(subs) * 8
            + (fnv1a(tid) % 26),
        )
        techniques.append(
            {
                "id": tid,
                "name": o["name"],
                "tactics": phases,
                "desc": clean(o.get("description", "")),
                "platforms": sorted(o.get("x_mitre_platforms", [])),
                "subs": subs,
                "heat": heat,
                "services": services,
            }
        )

    techniques.sort(key=lambda t: t["id"])
    data = {
        "source": "MITRE ATT&CK Enterprise",
        "version": collection.get("x_mitre_version", "unknown"),
        "modified": collection.get("modified", "")[:10],
        "generated": datetime.date.today().isoformat(),
        "tactics": tactics,
        "techniques": techniques,
        "counts": {
            "tactics": len(tactics),
            "techniques": len(techniques),
            "subtechniques": sum(len(t["subs"]) for t in techniques),
            "groups": len(
                [o for o in objs if o["type"] == "intrusion-set" and not o.get("revoked")]
            ),
            "software": len(
                [
                    o
                    for o in objs
                    if o["type"] in ("malware", "tool") and not o.get("revoked")
                ]
            ),
        },
    }
    with open(OUT, "w") as f:
        json.dump(data, f, separators=(",", ":"), ensure_ascii=False)
    print(
        f"Wrote {OUT}: {len(techniques)} techniques, "
        f"{data['counts']['subtechniques']} sub-techniques, {len(tactics)} tactics"
    )


if __name__ == "__main__":
    main()
