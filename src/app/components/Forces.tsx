type force = Promise<any>;

export default async function Forces() {
  const res = await fetch(`${process.env.NEXT_URL}/api/test`);
  const forces: force = await res.json();
  console.log(forces);

  return <></>;
}
