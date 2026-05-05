import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignIn 
        appearance={{
          variables: {
            colorPrimary: "#059669",
            colorBackground: "transparent",
            colorText: "#0f172a",
          },
          elements: {
            rootBox: "w-full max-w-md",
            cardBox: "shadow-none",
            card: "bg-transparent shadow-none border-0 p-0 !bg-transparent !shadow-none",
            headerTitle: "text-3xl font-bold text-slate-900",
            headerSubtitle: "text-slate-500 mb-4",
            formButtonPrimary: "bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-3 shadow-none transition-colors",
            formFieldInput: "rounded-xl border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 py-3",
            formFieldLabel: "text-slate-700 font-medium",
            socialButtonsBlockButton: "rounded-xl border-slate-200 hover:bg-slate-50 py-3 transition-colors",
            dividerLine: "bg-slate-200",
            dividerText: "text-slate-400",
            footerActionLink: "text-emerald-700 hover:text-emerald-800 font-medium",
            footer: "bg-transparent border-0 px-0 pb-0",
            developmentModeBadge: "text-emerald-600 bg-emerald-50 border border-emerald-200",
            footerAction: "bg-transparent",
          }
        }}
      />
    </div>
  );
}
