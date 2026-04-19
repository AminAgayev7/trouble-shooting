'use client';

import * as Sentry from "@sentry/nextjs";
import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = {
    children: ReactNode;
    fallback?: ReactNode;
    context?: string; 
};

type ErrorBoundaryState = {
    hasError: boolean;
    errorMessage: string;
    retryCount: number;
};

const max_retries = 3;

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, errorMessage: "", retryCount: 0 };
    }

    static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return { hasError: true, errorMessage: message };
    }

    componentDidCatch(error: unknown, info: { componentStack: string }): void {
        const { context } = this.props;


        Sentry.captureException(error, {
            extra: {
                context: context ?? "unknown",
                componentStack: info.componentStack,
                retryCount: this.state.retryCount,
            },
        });

        console.error(`[ErrorBoundary] ${context ?? "unknown"}:`, error);
    }

    handleRetry = () => {
        if (this.state.retryCount >= max_retries) {
            return;
        }
        this.setState((prev) => ({
            hasError: false,
            errorMessage: "",
            retryCount: prev.retryCount + 1,
        }));
    };

    render(): ReactNode {
        if (this.state.hasError) {

            if (this.props.fallback) {
                return this.props.fallback;
            }
            const { retryCount } = this.state;
            const canRetry = retryCount < max_retries;

            return (
                <div className="p-4 rounded-lg bg-red-950/30 border border-red-800/50 text-center">
                    <p className="text-red-400 font-bold mb-1">Something went wrong</p>
                    <p className="text-red-300 text-sm">{this.state.errorMessage}</p>
                    {this.props.context && (
                        <p className="text-red-500 text-xs mt-1">Section: {this.props.context}</p>
                    )}
                    {canRetry ? (
                        <button
                            onClick={this.handleRetry}
                            className="mt-3 px-4 py-1 text-sm rounded-lg bg-red-800 hover:bg-red-700 text-white transition-colors"
                        >
                            Try again ({max_retries - retryCount} left)
                        </button>
                    ) : (
                        <p className="text-red-500 text-xs mt-3">
                            Max retries reached. Please refresh the page.
                        </p>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}