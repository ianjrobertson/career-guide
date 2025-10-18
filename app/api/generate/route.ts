import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the JSON data from the request
    const data = await request.json();

    // Replace with your n8n webhook URL
    const n8nWebhookUrl =
        'https://quantiedge.app.n8n.cloud/webhook/8268dd3d-3bce-4401-9796-a0d848b19e9d';

    // Send data to n8n webhook
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Get the response from n8n
    const result = await response.json();

    // Return the response
    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json(
        {error: `${error instanceof Error ? error.message : "Error occured! Uh oh"}`}, {status: 500});
  }
}