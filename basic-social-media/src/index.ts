import app from "./server";
const PORT = parseInt(process.env.PORT || "4000");

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}`);
});
