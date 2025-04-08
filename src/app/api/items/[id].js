import dbConnect from "../../../../lib/mongodb";
import Item from "../../../../models/Item";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "PUT":
      try {
        const item = await Item.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!item) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: item });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const item = Item.create(req.body);
        res.status(201).json({ success: true, data: item });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deleteItem = Item.deleteOne({ _id: id });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
