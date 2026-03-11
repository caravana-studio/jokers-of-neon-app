import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useCreateListing } from "../hooks/useCreateListing";
import { parseTokenAmount } from "../utils/formatPrice";
import { PAYMENT_TOKENS } from "../config/contracts";
import type { UserCard } from "../types/marketplace";

interface ListingFormProps {
  card: UserCard;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EXPIRY_OPTIONS = [
  { label: "1 Day", value: 1 },
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
];

const STATUS_TEXT: Record<string, string> = {
  idle: "LIST FOR SALE",
  approving: "APPROVING NFT...",
  signing: "SIGN ORDER...",
  submitting: "SUBMITTING...",
  done: "LISTED!",
  error: "RETRY",
};

export function ListingForm({ card, onSuccess, onCancel }: ListingFormProps) {
  const [price, setPrice] = useState("");
  const [paymentToken, setPaymentToken] = useState<string>(PAYMENT_TOKENS[0].address);
  const [expiryDays, setExpiryDays] = useState(7);
  const { create, status, error, reset } = useCreateListing();

  const selectedToken = PAYMENT_TOKENS.find((t) => t.address === paymentToken)!;
  const isProcessing = ["approving", "signing", "submitting"].includes(status);

  const handleSubmit = async () => {
    if (!price || parseFloat(price) <= 0) return;
    if (status === "error") reset();

    const priceWei = parseTokenAmount(price, selectedToken.decimals);
    await create(card, paymentToken, priceWei, expiryDays);
    if (status === "done") onSuccess?.();
  };

  return (
    <Box bg="rgba(0,0,0,0.6)" border="1px solid" borderColor="whiteAlpha.200" borderRadius="15px" p={6}>
      <VStack spacing={4} align="stretch">
        <Text fontFamily="Orbitron" fontSize={14} color="white" textTransform="uppercase">
          List Card #{card.cardId} for Sale
        </Text>

        <FormControl>
          <FormLabel fontFamily="Oxanium" color="whiteAlpha.800" fontSize={12}>
            Price
          </FormLabel>
          <Input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            variant="neon-white"
            step="0.001"
            min="0"
            fontFamily="Orbitron"
            fontSize={16}
            color="white"
            borderBottom="1px solid"
            borderColor="whiteAlpha.400"
          />
        </FormControl>

        <FormControl>
          <FormLabel fontFamily="Oxanium" color="whiteAlpha.800" fontSize={12}>
            Payment Token
          </FormLabel>
          <Select
            value={paymentToken}
            onChange={(e) => setPaymentToken(e.target.value)}
            fontFamily="Orbitron"
            fontSize={12}
            bg="transparent"
            color="white"
            borderColor="whiteAlpha.400"
          >
            {PAYMENT_TOKENS.map((t) => (
              <option key={t.address} value={t.address} style={{ background: "black" }}>
                {t.symbol}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontFamily="Oxanium" color="whiteAlpha.800" fontSize={12}>
            Expiration
          </FormLabel>
          <Select
            value={expiryDays}
            onChange={(e) => setExpiryDays(Number(e.target.value))}
            fontFamily="Orbitron"
            fontSize={12}
            bg="transparent"
            color="white"
            borderColor="whiteAlpha.400"
          >
            {EXPIRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: "black" }}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormControl>

        {error && (
          <Text color="red.400" fontSize={10}>
            {error}
          </Text>
        )}

        <Button
          size="md"
          variant={status === "done" ? "outline" : "solid"}
          onClick={handleSubmit}
          isLoading={isProcessing}
          isDisabled={!price || parseFloat(price) <= 0 || status === "done"}
        >
          {STATUS_TEXT[status]}
        </Button>

        {onCancel && (
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </VStack>
    </Box>
  );
}
