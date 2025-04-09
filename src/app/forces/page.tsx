'use client';

import { useEffect, useState } from "react";

export default function Home() {
  const fetchForces = async () => {
    const res = await fetch('http://localhost:3000/api/forces');
    const forces = await res.json()
    return forces;
  }

  const [forces, setForces] = useState([]);

  useEffect(() => {
    fetchForces().then((forces) => {
      setForces(forces);
    })
  }, []);

  return (
    <>
      <h2>Forces</h2>
      {forces.map(force => (
        <div key={force.id}>
          <h3>{force.name}</h3>
        </div>
      ))}
    </>
  );
}
