
import { recordLedgerEvent } from "./ledgerService.js";

export const recordSettlementLedgerEvent = async ({
    settlement,
    actorId,
}) => {
    if (!settlement?._id) {
        throw new Error(
            "A saved settlement record is required."
        );
    }

    if (!actorId) {
        throw new Error(
            "The settlement confirmation actor is required."
        );
    }

    return recordLedgerEvent({
        eventType: "SETTLEMENT_RECORDED",
        entityType: "SETTLEMENT",
        entityId: settlement._id,
        dealId: settlement.deal,
        paymentId: settlement.payment,
        actor: actorId,
        details: {
            amount: settlement.amount,
            currency: settlement.currency,
            status: settlement.status,
            reference: settlement.reference || null,
            settledAt: settlement.settledAt,
        },
    });
};
