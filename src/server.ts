import app from "./infrastructure/config/app";
import connectDB from "./infrastructure/config/db";
import categoryModal from "./infrastructure/db/categorySchema";

let PORT: string = process.env.PORT!;

// database connection
connectDB();

// create server
app.listen(PORT, () => console.log("http://localhost:3000"));
