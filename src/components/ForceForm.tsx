import { Forces } from "@/models/forces";

interface ForceFormProps {
  force: Forces;                           // pre‑filled data
  onSubmit: (payload: Partial<Forces>) => Promise<void>;
}

export default function ForceForm({ force, onSubmit }: ForceFormProps) {
  
  return (
    <form
      action={async (formData) => {
        await onSubmit({
          name: formData.get("name") as string,
          supplyLimit: Number(formData.get("supplyLimit")),
          // grab the rest…
        });
      }}
      className="grid gap-4"
    >
      <label className="block">
        Name
        <input
          name="name"
          defaultValue={force.name}
          className="input"
        />
      </label>
      {/* repeat for tally, units, etc. */}
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
