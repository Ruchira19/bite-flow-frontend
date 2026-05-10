import { useEffect, useState } from "react";
import { getAllPayments } from "../service/AdminService";
import { Payment } from "../model/types";
import { Alert } from "../util/Alert";
import { Loading } from "../util/Loading";
import { extractErrorMessage } from "../service/api";

// student note: keeping important value in a const
export const PaymentsPage = () => {
  // Store all payment records returned from the backend.
  // student note: keeping important value in a const
  const [payments, setPayments] = useState<Payment[]>([]);

  // Controls the loading spinner visibility while API calls are running.
  // student note: keeping important value in a const
  const [loading, setLoading] = useState(true);

  // Holds API or network error messages displayed to the admin user.
  // student note: keeping important value in a const
  const [error, setError] = useState("");

  // Fetch all payment records when the page loads for the first time.
  useEffect(() => {
    // student note: keeping important value in a const
    const loadPayments = async () => {
      setLoading(true);
      try {
        setPayments(await getAllPayments());
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  if (loading) {
    // student note: returning the output from this part
    return <Loading label="Loading payments..." />;
  }

  // student note: returning the output from this part
  return (
    
    <section className="space-y-6">
      
      {/* Page header section */}
      
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
          Payments
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">
          Payment activity
        </h2>
      </div>
      {error ? (
        <Alert type="failed" message={error} onClose={() => setError("")} />
      ) : null}

      {/* Payment records table container */}
      
      <div className="overflow-hidden sounded-3xl border border-stone-200 bg-white shadow-sm">
        {/* Payment activity table */}1
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50">
            <tr>
              {["Payment ID", "Order ID", "Amount", "Status", "Reference", "Paid At"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left font-semibold text-stone-600"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td className="px-4 py-3">{payment.paymentId}</td>
                <td className="px-4 py-3">{payment.orderId}</td>
                <td className="px-4 py-3">Rs. {payment.amount.toFixed(2)}</td>
                <td className="px-4 py-3">{payment.status}</td>
                <td className="px-4 py-3">{payment.transactionReference}</td>
                <td className="px-4 py-3">
                  {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
