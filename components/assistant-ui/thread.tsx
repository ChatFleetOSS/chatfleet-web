import {
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  Square,
} from "lucide-react";

import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";

import type { FC } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import {
  ComposerAddAttachment,
  ComposerAttachments,
  UserMessageAttachments,
} from "@/components/assistant-ui/attachment";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

type SuggestionConfig = {
  prompt: string;
  label?: string;
  title?: string;
};

type ThreadProps = {
  composerPlaceholder?: string;
  suggestions?: SuggestionConfig[];
  suggestionsPlacement?: "welcome" | "composer";
  suggestionsLabel?: string;
  assistantLabel?: string;
};

export const Thread: FC<ThreadProps> = ({
  composerPlaceholder,
  suggestions,
  suggestionsPlacement = "welcome",
  suggestionsLabel,
  assistantLabel,
}) => {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <ThreadPrimitive.Root
          className="aui-root aui-thread-root @container grid h-full min-h-0 grid-rows-[1fr_auto] bg-background"
          style={{
            ["--thread-max-width" as string]: "44rem",
          }}
        >
          <ThreadPrimitive.Viewport
            autoScroll
            className="aui-thread-viewport flex h-full flex-col overflow-x-hidden overflow-y-auto px-4 py-6"
          >
            <ThreadPrimitive.If empty>
              <ThreadWelcome
                suggestions={
                  suggestionsPlacement === "welcome" ? suggestions : undefined
                }
              />
            </ThreadPrimitive.If>

            <ThreadPrimitive.Messages
              components={{
                UserMessage,
                EditComposer,
                AssistantMessage: () => (
                  <AssistantMessage label={assistantLabel} />
                ),
              }}
            />

            <ThreadPrimitive.If empty={false}>
              <div className="aui-thread-viewport-spacer min-h-8 shrink-0" />
            </ThreadPrimitive.If>
          </ThreadPrimitive.Viewport>

          <Composer
            placeholder={composerPlaceholder}
            inlineSuggestions={
              suggestionsPlacement === "composer" ? suggestions : undefined
            }
            suggestionsLabel={suggestionsLabel}
          />
        </ThreadPrimitive.Root>
      </MotionConfig>
    </LazyMotion>
  );
};

const ThreadWelcome: FC<{
  suggestions?: SuggestionConfig[];
}> = ({ suggestions }) => {
  const t = useTranslation();
  const suggestionItems =
    suggestions ??
    [
      {
        title: t("thread.suggestion.weather.title"),
        label: t("thread.suggestion.weather.description"),
        prompt: t("thread.suggestion.weather.action"),
      },
      {
        title: t("thread.suggestion.hooks.title"),
        label: t("thread.suggestion.hooks.description"),
        prompt: t("thread.suggestion.hooks.action"),
      },
      {
        title: t("thread.suggestion.sql.title"),
        label: t("thread.suggestion.sql.description"),
        prompt: t("thread.suggestion.sql.action"),
      },
      {
        title: t("thread.suggestion.meal.title"),
        label: t("thread.suggestion.meal.description"),
        prompt: t("thread.suggestion.meal.action"),
      },
    ];

  return (
    <div className="aui-thread-welcome-root mx-auto my-auto flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
      <div className="aui-thread-welcome-center flex w-full flex-grow flex-col items-center justify-center">
        <div className="aui-thread-welcome-message flex size-full flex-col justify-center px-8">
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="aui-thread-welcome-message-motion-1 text-2xl font-semibold"
          >
            {t("thread.welcomeTitle")}
          </m.div>
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
            className="aui-thread-welcome-message-motion-2 text-2xl text-muted-foreground/65"
          >
            {t("thread.welcomeSubtitle")}
          </m.div>
        </div>
      </div>
      <ThreadSuggestions suggestions={suggestionItems} send={false} />
    </div>
  );
};

const ThreadSuggestions: FC<{
  suggestions: SuggestionConfig[];
  send?: boolean;
  label?: string;
}> = ({ suggestions, send = false, label }) => {
  return (
    <div className="aui-thread-welcome-suggestions grid w-full gap-2 pb-4 @md:grid-cols-2">
      {label ? (
        <div className="col-span-full text-sm font-medium text-muted-foreground">
          {label}
        </div>
      ) : null}
      {suggestions.map((suggestedAction, index) => (
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="aui-thread-welcome-suggestion-display [&:nth-child(n+3)]:hidden @md:[&:nth-child(n+3)]:block"
        >
          <ThreadPrimitive.Suggestion
            prompt={suggestedAction.prompt}
            send={send}
            clearComposer
            asChild
          >
            <Button
              variant="ghost"
              className="aui-thread-welcome-suggestion h-auto w-full flex-1 flex-wrap items-start justify-start gap-1 rounded-3xl border px-5 py-4 text-left text-sm @md:flex-col dark:hover:bg-accent/60"
              aria-label={suggestedAction.prompt}
            >
              {suggestedAction.title ? (
                <span className="aui-thread-welcome-suggestion-text-1 font-medium">
                  {suggestedAction.title}
                </span>
              ) : null}
              {suggestedAction.label ? (
                <span className="aui-thread-welcome-suggestion-text-2 text-muted-foreground">
                  {suggestedAction.label}
                </span>
              ) : null}
            </Button>
          </ThreadPrimitive.Suggestion>
        </m.div>
      ))}
    </div>
  );
};

type ComposerProps = {
  placeholder?: string;
  inlineSuggestions?: SuggestionConfig[];
  suggestionsLabel?: string;
};

const Composer: FC<ComposerProps> = ({
  placeholder,
  inlineSuggestions,
  suggestionsLabel,
}) => {
  const t = useTranslation();
  const resolvedPlaceholder = placeholder ?? t("thread.composer.placeholder");
  return (
    <div className="aui-composer-wrapper border-t border-border bg-background px-4 pb-6 pt-4">
      <ComposerPrimitive.Root className="aui-composer-root relative mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col rounded-3xl border border-border bg-muted px-1 pt-2 shadow-[0_9px_9px_0px_rgba(0,0,0,0.01),0_2px_5px_0px_rgba(0,0,0,0.06)] dark:border-muted-foreground/15">
        <ComposerAttachments />
        <ComposerPrimitive.Input
          placeholder={resolvedPlaceholder}
          className="aui-composer-input mb-1 max-h-32 min-h-16 w-full resize-none bg-transparent px-3.5 pt-1.5 pb-3 text-base outline-none placeholder:text-muted-foreground focus:outline-primary"
          rows={1}
          autoFocus
          aria-label={t("thread.composer.ariaLabel")}
        />
        {inlineSuggestions && inlineSuggestions.length > 0 ? (
          <div
            className="aui-inline-suggestions mx-1 mb-2 flex flex-col gap-2 px-2"
            role="group"
            aria-label={suggestionsLabel ?? t("thread.suggestionGroupLabel")}
          >
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {suggestionsLabel ?? t("thread.suggestionGroupLabel")}
            </div>
            <div className="flex flex-wrap gap-2">
              {inlineSuggestions.map((suggestion) => (
                <ThreadPrimitive.Suggestion
                  key={suggestion.prompt}
                  prompt={suggestion.prompt}
                  send={false}
                  clearComposer
                  asChild
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full bg-background px-3 py-1 text-sm font-medium text-foreground shadow-sm hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label={suggestion.prompt}
                    type="button"
                  >
                    {suggestion.label ?? suggestion.prompt}
                  </Button>
                </ThreadPrimitive.Suggestion>
              ))}
            </div>
          </div>
        ) : null}
        <ComposerAction />
      </ComposerPrimitive.Root>
    </div>
  );
};

const ComposerAction: FC = () => {
  const t = useTranslation();
  return (
    <div className="aui-composer-action-wrapper relative mx-1 mt-2 mb-2 flex items-center justify-between">
      <ComposerAddAttachment />

      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip={t("thread.tooltips.send")}
            side="bottom"
            type="submit"
            variant="default"
            size="icon"
            className="aui-composer-send size-[34px] rounded-full p-1"
            aria-label={t("thread.tooltips.send")}
          >
            <ArrowUpIcon className="aui-composer-send-icon size-5" />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <Button
            type="button"
            variant="default"
            size="icon"
            className="aui-composer-cancel size-[34px] rounded-full border border-muted-foreground/60 hover:bg-primary/75 dark:border-muted-foreground/90"
            aria-label={t("thread.tooltips.cancel")}
          >
            <Square className="aui-composer-cancel-icon size-3.5 fill-white dark:fill-black" />
          </Button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/5 dark:text-red-200">
        <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantMessage: FC<{ label?: string }> = ({ label }) => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-assistant-message-root relative mx-auto w-full max-w-[var(--thread-max-width)] animate-in py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 last:mb-24"
        data-role="assistant"
      >
        <div className="aui-assistant-message-content mx-2 leading-7 break-words text-foreground">
          {label ? (
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </div>
          ) : null}
          <MessagePrimitive.Parts
            components={{
              Text: MarkdownText,
              tools: { Fallback: ToolFallback },
            }}
          />
          <MessageError />
        </div>

        <div className="aui-assistant-message-footer mt-2 ml-2 flex">
          <BranchPicker />
          <AssistantActionBar />
        </div>
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  const t = useTranslation();
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="aui-assistant-action-bar-root col-start-3 row-start-2 -ml-1 flex gap-1 text-muted-foreground data-floating:absolute data-floating:rounded-md data-floating:border data-floating:bg-background data-floating:p-1 data-floating:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip={t("thread.tooltips.copy")}>
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip={t("thread.tooltips.refresh")}>
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <div
        className="aui-user-message-root mx-auto grid w-full max-w-[var(--thread-max-width)] animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 px-2 py-4 duration-150 ease-out fade-in slide-in-from-bottom-1 first:mt-3 last:mb-5 [&:where(>*)]:col-start-2"
        data-role="user"
      >
        <UserMessageAttachments />

        <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
          <div className="aui-user-message-content rounded-3xl bg-muted px-5 py-2.5 break-words text-foreground">
            <MessagePrimitive.Parts />
          </div>
          <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2">
            <UserActionBar />
          </div>
        </div>

        <BranchPicker className="aui-user-branch-picker col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
      </div>
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  const t = useTranslation();
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton
          tooltip={t("thread.tooltips.edit")}
          className="aui-user-action-edit p-4"
        >
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  const t = useTranslation();
  return (
    <div className="aui-edit-composer-wrapper mx-auto flex w-full max-w-[var(--thread-max-width)] flex-col gap-4 px-2 first:mt-4">
      <ComposerPrimitive.Root className="aui-edit-composer-root ml-auto flex w-full max-w-7/8 flex-col rounded-xl bg-muted">
        <ComposerPrimitive.Input
          className="aui-edit-composer-input flex min-h-[60px] w-full resize-none bg-transparent p-4 text-foreground outline-none"
          autoFocus
        />

        <div className="aui-edit-composer-footer mx-3 mb-3 flex items-center justify-center gap-2 self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label={t("thread.edit.cancelAria")}
            >
              {t("common.cancel")}
            </Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button size="sm" aria-label={t("thread.edit.updateAria")}>
              {t("thread.edit.update")}
            </Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </div>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  const t = useTranslation();
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "aui-branch-picker-root mr-2 -ml-2 inline-flex items-center text-xs text-muted-foreground",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip={t("thread.branch.previous")}>
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip={t("thread.branch.next")}>
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};
