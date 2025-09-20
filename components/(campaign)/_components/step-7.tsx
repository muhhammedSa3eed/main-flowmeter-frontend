'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RfpFormData } from '@/types';

export function Step7() {
  const { control } = useFormContext<RfpFormData>();

  const installationFields = [
    { name: 'hydraulicUpstream', label: 'Hydraulic Upstream' },
    { name: 'hydraulicDownstream', label: 'Hydraulic Downstream' },
    { name: 'environmental', label: 'Environmental' },
    { name: 'onSiteTesting', label: 'On-site Testing' },
    { name: 'safetyRisks', label: 'Safety Risks' },
    { name: 'securityOfLocation', label: 'Security of Location' },
  ] as const;

  return (
    <div className="rounded-xl border bg-muted/50 p-6 shadow-sm space-y-3">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {installationFields.map((fieldDef) => {
          const fullName = `FlowmeterInstallationMaintenance.installation.${fieldDef.name}` as const;

          return (
            <FormField
              key={fullName}
              control={control}
              name={fullName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldDef.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
                      {...field}
                      value={typeof field.value === 'string' ? field.value : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </div>

      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-base font-semibold">Flowmeter Maintenance</h3>

        <FormField
          control={control}
          name="FlowmeterInstallationMaintenance.maintenance.maintenanceRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Reference to corrective &amp; preventative maintenance procedures
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="true"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="false"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                    />
                    No
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="FlowmeterInstallationMaintenance.maintenance.preventativeScheduleRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Reference to preventative maintenance programme/schedule
              </FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="true"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      value="false"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                    />
                    No
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
