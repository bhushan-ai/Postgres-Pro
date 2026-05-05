import app from "./server";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}`);
});
