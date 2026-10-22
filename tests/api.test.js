process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");

describe("Task API", () => {
  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("GET /api/tasks returns a list", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/tasks creates a task", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "Write tests" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: "Write tests", done: false });
  });

  test("POST /api/tasks rejects empty title", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "   " });
    expect(res.status).toBe(400);
  });

  test("PUT /api/tasks/:id updates a task", async () => {
    const created = await request(app).post("/api/tasks").send({ title: "Update me" });
    const res = await request(app)
      .put(`/api/tasks/${created.body.id}`)
      .send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
  });

  test("DELETE /api/tasks/:id removes a task", async () => {
    const created = await request(app).post("/api/tasks").send({ title: "Delete me" });
    const del = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(del.status).toBe(204);
    const get = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(get.status).toBe(404);
  });

  test("unknown route returns 404", async () => {
    const res = await request(app).get("/nope");
    expect(res.status).toBe(404);
  });
});
