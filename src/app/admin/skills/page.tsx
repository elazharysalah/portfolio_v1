"use client";

import { FormEvent, useEffect, useState } from "react";

type Skill = { id: string; name: string; sortOrder: number; groupId: string };
type Group = { id: string; name: string; sortOrder: number; skills: Skill[] };

export default function AdminSkillsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState("");
  const [skillName, setSkillName] = useState("");
  const [groupId, setGroupId] = useState("");

  async function load() {
    const data = await (await fetch("/api/admin/skills")).json();
    setGroups(data);
    if (!groupId && data[0]) setGroupId(data[0].id);
  }

  useEffect(() => {
    load();
  }, []);

  async function addGroup(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName, sortOrder: groups.length }),
    });
    setGroupName("");
    load();
  }

  async function addSkill(e: FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "skill", name: skillName, groupId, sortOrder: 0 }),
    });
    setSkillName("");
    load();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Skills</h1>

      <form className="admin-card" onSubmit={addGroup}>
        <label className="field">
          New group
          <input value={groupName} onChange={(e) => setGroupName(e.target.value)} required />
        </label>
        <button className="btn-primary" type="submit">
          Add group
        </button>
      </form>

      <form className="admin-card" onSubmit={addSkill}>
        <label className="field">
          Group
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)} required>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Skill name
          <input value={skillName} onChange={(e) => setSkillName(e.target.value)} required />
        </label>
        <button className="btn-primary" type="submit">
          Add skill
        </button>
      </form>

      {groups.map((group) => (
        <div className="admin-card" key={group.id}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <strong>{group.name}</strong>
            <button
              type="button"
              className="admin-btn danger"
              onClick={async () => {
                await fetch(`/api/admin/skills?id=${group.id}&type=group`, { method: "DELETE" });
                load();
              }}
            >
              Delete group
            </button>
          </div>
          <ul>
            {group.skills.map((skill) => (
              <li key={skill.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <span>{skill.name}</span>
                <button
                  type="button"
                  className="admin-btn danger"
                  onClick={async () => {
                    await fetch(`/api/admin/skills?id=${skill.id}&type=skill`, { method: "DELETE" });
                    load();
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
