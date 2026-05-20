import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#18181b",
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
    backgroundColor: "#ffffff",
  },
  // Header
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 },
  brandName: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#18181b" },
  brandTagline: { fontSize: 9, color: "#71717a", marginTop: 2 },
  invoiceLabel: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "#e4e4e7", textAlign: "right" },
  invoiceNumber: { fontSize: 10, color: "#71717a", textAlign: "right", marginTop: 2 },

  // Divider
  divider: { height: 1, backgroundColor: "#e4e4e7", marginVertical: 20 },

  // Info grid
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  infoBlock: { flexDirection: "column", gap: 4 },
  infoLabel: { fontSize: 8, color: "#71717a", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  infoValue: { fontSize: 10, color: "#18181b" },
  infoBold: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#18181b" },

  // Table
  tableHeader: { flexDirection: "row", backgroundColor: "#f4f4f5", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4 },
  tableRow: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#f4f4f5" },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "center" },
  col3: { flex: 1, textAlign: "right" },
  colHeader: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#71717a", textTransform: "uppercase", letterSpacing: 0.5 },
  colValue: { fontSize: 10, color: "#18181b" },

  // Totals
  totalsContainer: { alignItems: "flex-end", marginTop: 16 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", width: 220, paddingVertical: 4 },
  totalLabel: { fontSize: 10, color: "#71717a" },
  totalValue: { fontSize: 10, color: "#18181b" },
  grandTotalRow: { flexDirection: "row", justifyContent: "space-between", width: 220, paddingVertical: 8, marginTop: 4, borderTopWidth: 1, borderTopColor: "#e4e4e7" },
  grandTotalLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#18181b" },
  grandTotalValue: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#18181b" },

  // Status badge
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: "flex-start" },
  statusSuccess: { backgroundColor: "#dcfce7" },
  statusPending: { backgroundColor: "#fef9c3" },
  statusText: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  statusSuccessText: { color: "#166534" },
  statusPendingText: { color: "#854d0e" },

  // Footer
  footer: { position: "absolute", bottom: 32, left: 56, right: 56 },
  footerDivider: { height: 1, backgroundColor: "#e4e4e7", marginBottom: 12 },
  footerText: { fontSize: 8, color: "#a1a1aa", textAlign: "center" },
  footerNote: { fontSize: 8, color: "#71717a", textAlign: "center", marginTop: 3 },

  // Note box
  noteBox: { marginTop: 32, padding: 14, backgroundColor: "#f9f9f9", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: "#a1a1aa" },
  noteText: { fontSize: 9, color: "#71717a", lineHeight: 1.6 },
});

// ── Types ─────────────────────────────────────────────────────────────────────
interface InvoicePDFProps {
  invoiceNumber: string;
  payment: {
    id: string;
    razorpayPaymentId: string;
    amount: number;        // in paise
    type: string;          // ONBOARDING | RENEWAL
    status: string;
    createdAt: string;
  };
  user: {
    name: string;
    email: string;
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatAmount(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

// ── PDF Component ─────────────────────────────────────────────────────────────
export function InvoicePDF({ invoiceNumber, payment, user }: InvoicePDFProps) {
  const isSuccess = payment.status === "SUCCESS";
  const subtotal = payment.amount; // paise
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal; // price is GST-inclusive

  const description =
    payment.type === "ONBOARDING"
      ? "ReviewQR AI — One-time Onboarding Setup"
      : "ReviewQR AI — Monthly Maintenance Renewal";

  return (
    <Document title={invoiceNumber} author="ReviewQR AI">
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.headerRow}>
          <View>
            <Text style={s.brandName}>ReviewQR AI</Text>
            <Text style={s.brandTagline}>AI-Powered Google Review Platform</Text>
          </View>
          <View>
            <Text style={s.invoiceLabel}>INVOICE</Text>
            <Text style={s.invoiceNumber}>{invoiceNumber}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* ── Billed To / Invoice Details ── */}
        <View style={s.infoRow}>
          <View style={s.infoBlock}>
            <Text style={s.infoLabel}>Billed To</Text>
            <Text style={s.infoBold}>{user.name}</Text>
            <Text style={s.infoValue}>{user.email}</Text>
          </View>
          <View style={s.infoBlock}>
            <Text style={s.infoLabel}>Invoice Date</Text>
            <Text style={s.infoValue}>{formatDate(payment.createdAt)}</Text>
            <Text style={{ ...s.infoLabel, marginTop: 10 }}>Payment ID</Text>
            <Text style={s.infoValue}>{payment.razorpayPaymentId}</Text>
          </View>
          <View style={s.infoBlock}>
            <Text style={s.infoLabel}>Status</Text>
            <View style={[s.statusBadge, isSuccess ? s.statusSuccess : s.statusPending]}>
              <Text style={[s.statusText, isSuccess ? s.statusSuccessText : s.statusPendingText]}>
                {isSuccess ? "PAID" : payment.status}
              </Text>
            </View>
            <Text style={{ ...s.infoLabel, marginTop: 10 }}>Plan Type</Text>
            <Text style={s.infoValue}>{payment.type === "ONBOARDING" ? "Onboarding" : "Monthly Renewal"}</Text>
          </View>
        </View>

        {/* ── Line Items Table ── */}
        <View style={s.tableHeader}>
          <Text style={[s.colHeader, s.col1]}>Description</Text>
          <Text style={[s.colHeader, s.col2]}>Qty</Text>
          <Text style={[s.colHeader, s.col3]}>Amount</Text>
        </View>

        <View style={s.tableRow}>
          <Text style={[s.colValue, s.col1]}>{description}</Text>
          <Text style={[s.colValue, s.col2]}>1</Text>
          <Text style={[s.colValue, s.col3]}>{formatAmount(subtotal - gst)}</Text>
        </View>

        <View style={s.tableRow}>
          <Text style={[s.colValue, s.col1]}>GST @ 18%</Text>
          <Text style={[s.colValue, s.col2]}></Text>
          <Text style={[s.colValue, s.col3]}>{formatAmount(gst)}</Text>
        </View>

        {/* ── Totals ── */}
        <View style={s.totalsContainer}>
          <View style={s.grandTotalRow}>
            <Text style={s.grandTotalLabel}>Total Paid</Text>
            <Text style={s.grandTotalValue}>{formatAmount(total)}</Text>
          </View>
        </View>

        {/* ── Note ── */}
        <View style={s.noteBox}>
          <Text style={s.noteText}>
            This is a computer-generated invoice and does not require a physical signature.
            For support, contact support@reviewqrai.com or visit ai-powered-google-review.vercel.app
          </Text>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View style={s.footerDivider} />
          <Text style={s.footerText}>ReviewQR AI · support@reviewqrai.com</Text>
          <Text style={s.footerNote}>Thank you for your business!</Text>
        </View>
      </Page>
    </Document>
  );
}
