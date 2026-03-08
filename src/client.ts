/**
 * OutX API client — shared HTTP wrapper with auth, error handling, and async task polling.
 */

export class OutxClient {
  private baseUrl = "https://api.outx.ai";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private headers(): Record<string, string> {
    return {
      "x-api-key": this.apiKey,
      "Content-Type": "application/json",
    };
  }

  private async handleResponse(res: Response): Promise<unknown> {
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        if (body.error) message = body.error;
        else if (body.message) message = body.message;
        else message = JSON.stringify(body);
      } catch {
        message = await res.text().catch(() => message);
      }
      throw new Error(message);
    }
    return res.json();
  }

  async get(path: string, params?: Record<string, string>): Promise<unknown> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== "") url.searchParams.set(k, v);
      }
    }
    const res = await fetch(url.toString(), { headers: this.headers() });
    return this.handleResponse(res);
  }

  async post(path: string, body: unknown): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(res);
  }

  async put(path: string, body: unknown): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "PUT",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(res);
  }

  async delete(path: string, body: unknown): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "DELETE",
      headers: this.headers(),
      body: JSON.stringify(body),
    });
    return this.handleResponse(res);
  }

  /**
   * Poll an async LinkedIn Data API task until it completes or fails.
   * Returns the task_output on success.
   */
  async pollTask(
    taskId: string,
    maxAttempts = 30,
    delayMs = 5000
  ): Promise<unknown> {
    for (let i = 0; i < maxAttempts; i++) {
      const result = (await this.get("/linkedin-agent/get-task-status", {
        api_agent_task_id: taskId,
      })) as { data: { status: string; task_output?: unknown } };

      const { status, task_output } = result.data;

      if (status === "completed") return task_output;
      if (status === "failed") {
        throw new Error(
          `Task failed: ${task_output ? JSON.stringify(task_output) : "unknown error"}`
        );
      }

      await new Promise((r) => setTimeout(r, delayMs));
    }

    throw new Error(
      `Task ${taskId} did not complete within ${(maxAttempts * delayMs) / 1000}s. ` +
        `Use get_task_status to check manually.`
    );
  }
}
