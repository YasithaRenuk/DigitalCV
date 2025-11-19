"use client";

import { useSearchParams } from "next/navigation";

function Page() {
  const searchParams = useSearchParams();

  const transactionId = searchParams.get("transactionId");
  const state = searchParams.get("state");
  const signature = searchParams.get("signature");

  return (
    <div>
      <h1>Payment Status Page</h1>

      <p><strong>Transaction ID:</strong> {transactionId}</p>
      <p><strong>Status:</strong> {state}</p>
      <p><strong>Signature:</strong> {signature}</p>
    </div>
  );
}

export default Page;
