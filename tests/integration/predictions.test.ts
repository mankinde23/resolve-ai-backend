import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { ApiError } from "../../src/lib/api-error.js";

vi.mock("../../src/services/ml-client.service.js", () => ({
  predictTicket: vi.fn(),
}));

import { predictTicket } from "../../src/services/ml-client.service.js";
import app from "../../src/app.js";

const mockPredictTicket = vi.mocked(predictTicket);

describe("POST /api/v1/predictions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a prediction for valid ticket text", async () => {
    mockPredictTicket.mockResolvedValue({
      predicted_category: "Account",
      model_version: "baseline-v1",
      confidence: 0.836315670551022,
    });

    const response = await request(app)
      .post("/api/v1/predictions")
      .send({ text: "I cannot reset my account password." });

    expect(response.status).toBe(200);
    expect(response.body.data.predicted_category).toBe("Account");
    expect(response.body.data.model_version).toBe("baseline-v1");
    expect(response.body.data.confidence).toBeCloseTo(0.8363);
    expect(mockPredictTicket).toHaveBeenCalledWith(
      "I cannot reset my account password.",
    );
  });

  it("rejects empty ticket text", async () => {
    const response = await request(app)
      .post("/api/v1/predictions")
      .send({ text: "   " });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(mockPredictTicket).not.toHaveBeenCalled();
  });

  it("rejects a missing text field", async () => {
    const response = await request(app).post("/api/v1/predictions").send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns a service-unavailable error when the ML service is offline", async () => {
    mockPredictTicket.mockRejectedValue(
      new ApiError(
        503,
        "ML_SERVICE_UNAVAILABLE",
        "The prediction service is currently unavailable.",
      ),
    );

    const response = await request(app)
      .post("/api/v1/predictions")
      .send({ text: "I cannot reset my account password." });

    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("ML_SERVICE_UNAVAILABLE");
  });
});
