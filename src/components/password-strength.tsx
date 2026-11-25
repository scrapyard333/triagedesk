const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const COLORS = ["bg-danger", "bg-danger", "bg-warning", "bg-accent", "bg-success"];

function strength(password: string) {
  if (password.length < 8) {
    return 0;
  }
  let points = 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1;
  if (/\d/.test(password)) points += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 14) points += 1;
  return points;
}

export function PasswordStrength({ password }: { password: string }) {
  if (password.length === 0) {
    return (
      <p className="text-xs text-muted">
        Use 8 or more characters with letters and numbers.
      </p>
    );
  }

  const level = strength(password);

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              segment <= level ? COLORS[level] : "bg-surface-2"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted">Password strength: {LABELS[level]}</p>
    </div>
  );
}
