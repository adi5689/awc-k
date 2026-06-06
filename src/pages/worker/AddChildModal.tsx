import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { SideDrawer } from '../../components/ui/side-drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { ManagedChild } from '../../data/childMonitoringData';
import { Baby, Phone } from 'lucide-react';

type ChildFormValues = {
  name: string;
  dob: string;
  gender: 'Male' | 'Female' | '';
  parentName: string;
  phoneNumber: string;
  birthWeight: string;
};

type AddChildModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ManagedChild) => void;
  initialChild?: ManagedChild | null;
};

const emptyForm: ChildFormValues = {
  name: '',
  dob: '',
  gender: '',
  parentName: '',
  phoneNumber: '',
  birthWeight: '0',
};

function getAgeLabel(dob: string) {
  if (!dob) return '0y 0m';
  const birthDate = new Date(dob);
  const now = new Date('2026-04-22');
  const months = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
  return `${Math.max(0, Math.floor(months / 12))}y ${Math.max(0, months % 12)}m`;
}

export function AddChildModal({ open, onOpenChange, onSubmit, initialChild }: AddChildModalProps) {
  const [form, setForm] = useState<ChildFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialChild) {
      setForm({
        name: initialChild.name,
        dob: initialChild.dob,
        gender: initialChild.gender,
        parentName: initialChild.parentName,
        phoneNumber: initialChild.phoneNumber,
        birthWeight: String(initialChild.birthWeight),
      });
      setErrors({});
      return;
    }
    setForm(emptyForm);
    setErrors({});
  }, [initialChild, open]);

  const title = useMemo(() => (initialChild ? 'Edit Child' : 'Add Child'), [initialChild]);
  const submitLabel = initialChild ? 'Save Changes' : 'Add Child';

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = 'Child name is required.';
    if (!form.dob) nextErrors.dob = 'Date of birth is required.';
    if (!form.gender) nextErrors.gender = 'Gender is required.';
    if (!form.parentName.trim()) nextErrors.parentName = 'Parent name is required.';
    if (!/^\d{10}$/.test(form.phoneNumber)) nextErrors.phoneNumber = 'Enter a valid 10-digit phone number.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      id: initialChild?.id ?? `child-${Date.now()}`,
      name: form.name.trim(),
      dob: form.dob,
      ageLabel: getAgeLabel(form.dob),
      gender: form.gender as 'Male' | 'Female',
      parentName: form.parentName.trim(),
      phoneNumber: form.phoneNumber,
      birthWeight: initialChild?.birthWeight ?? (Number(form.birthWeight) || 0),
      nutritionStatus: initialChild?.nutritionStatus ?? 'Normal',
    });

    onOpenChange(false);
  };

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Maintain child registration details for monitoring, follow-up, and service delivery."
      className="sm:max-w-3xl"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Required fields are saved into the child monitoring register.
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" form="child-registration-form">{submitLabel}</Button>
          </div>
        </div>
      }
    >
      <form id="child-registration-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-border bg-muted/30 p-1">
          <div className="grid gap-1 sm:grid-cols-2">
            {[
              { label: 'Profile', icon: Baby, active: true },
              { label: 'Guardian', icon: Phone, active: true },
            ].map((step) => (
              <div
                key={step.label}
                className="flex items-center justify-center gap-2 rounded-xl bg-card px-3 py-2 text-xs font-bold uppercase tracking-wider text-foreground shadow-sm"
              >
                <step.icon size={14} className="text-primary" />
                {step.label}
              </div>
            ))}
          </div>
        </div>

        <FormSection
          icon={Baby}
          title="Child Profile"
          description="Core identity fields used across attendance and development tracking."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Child Name" error={errors.name}>
              <Input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Enter child name"
              />
            </FormField>

            <FormField label="Date of Birth" error={errors.dob}>
              <Input
                type="date"
                value={form.dob}
                onChange={(event) => setForm((current) => ({ ...current, dob: event.target.value }))}
              />
            </FormField>

            <FormField label="Gender" error={errors.gender}>
              <Select
                value={form.gender}
                onValueChange={(value: 'Male' | 'Female') => setForm((current) => ({ ...current, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Calculated Age">
              <div className="flex h-10 items-center rounded-md border border-input bg-muted/40 px-3 text-sm font-medium text-muted-foreground">
                {form.dob ? getAgeLabel(form.dob) : 'Select date of birth'}
              </div>
            </FormField>
          </div>
        </FormSection>

        <FormSection
          icon={Phone}
          title="Guardian Details"
          description="Contact information for service updates, visits, and parent engagement."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Parent Name" error={errors.parentName}>
              <Input
                value={form.parentName}
                onChange={(event) => setForm((current) => ({ ...current, parentName: event.target.value }))}
                placeholder="Enter parent name"
              />
            </FormField>

            <FormField label="Phone Number" error={errors.phoneNumber}>
              <Input
                value={form.phoneNumber}
                onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value.replace(/\D/g, '').slice(0, 10) }))}
                placeholder="10-digit mobile number"
              />
            </FormField>
          </div>
        </FormSection>

      </form>
    </SideDrawer>
  );
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Baby;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={17} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}
