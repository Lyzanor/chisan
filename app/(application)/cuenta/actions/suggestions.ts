"use server";

import { redirect } from "next/navigation";

import { requireCurrentAccount } from "@/lib/accounts/auth";
import {
  createProducerSuggestionSubmissionService,
  createProducerSuggestionWithdrawalService,
  type ProducerSuggestionFormState,
} from "@/lib/accounts/producer-suggestion-submission";
import { SUGGESTION_ROUTE } from "@/lib/accounts/producer-suggestion-workflow";
import { getDatabase } from "@/lib/db";

import { redirectWithMessage } from "./navigation";

export type { ProducerSuggestionFormState } from "@/lib/accounts/producer-suggestion-submission";

export async function submitProducerSuggestionAction(
  state: ProducerSuggestionFormState,
  formData: FormData,
): Promise<ProducerSuggestionFormState> {
  return createProducerSuggestionSubmissionService({
    getDatabase,
    requireCurrentAccount: () => requireCurrentAccount(SUGGESTION_ROUTE),
    redirectWithMessage,
    redirect: redirect as (path: string) => never,
  })(state, formData);
}

export async function withdrawProducerSuggestionAction(
  formData: FormData,
): Promise<void> {
  return createProducerSuggestionWithdrawalService({
    getDatabase,
    requireCurrentAccount: () => requireCurrentAccount(SUGGESTION_ROUTE),
    redirectWithMessage,
  })(formData);
}
