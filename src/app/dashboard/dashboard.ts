import { DOCUMENT, computed, inject, signal } from '@angular/core';
import { Component } from '@angular/core';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmNativeSelectImports } from '@spartan-ng/helm/native-select';
import { HlmProgressImports } from '@spartan-ng/helm/progress';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

interface Member {
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly initials: string;
  readonly status: 'active' | 'invited' | 'suspended';
}

@Component({
  selector: 'app-dashboard',
  imports: [
    HlmAccordionImports,
    HlmAlertImports,
    HlmAvatarImports,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmCheckboxImports,
    HlmInputImports,
    HlmLabelImports,
    HlmNativeSelectImports,
    HlmProgressImports,
    HlmRadioGroupImports,
    HlmSeparatorImports,
    HlmSliderImports,
    HlmSwitchImports,
    HlmTableImports,
    HlmTabsImports,
    HlmTooltipImports,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly document = inject(DOCUMENT);

  protected readonly isDark = signal(false);

  // Form / preference state — kept as signals.
  protected readonly emailNotifications = signal(true);
  protected readonly pushNotifications = signal(false);
  protected readonly weeklyDigest = signal(true);
  protected readonly marketingEmails = signal(false);
  protected readonly plan = signal('pro');
  protected readonly defaultRole = signal('developer');
  protected readonly seatLimit = signal(25);

  protected readonly members = signal<Member[]>([
    { name: 'Thomas Hemmerich', email: 'thomas@acme.dev', role: 'Owner', initials: 'TH', status: 'active' },
    { name: 'Maria Schultz', email: 'maria@acme.dev', role: 'Admin', initials: 'MS', status: 'active' },
    { name: 'Jonas Becker', email: 'jonas@acme.dev', role: 'Developer', initials: 'JB', status: 'invited' },
    { name: 'Aylin Demir', email: 'aylin@acme.dev', role: 'Developer', initials: 'AD', status: 'active' },
    { name: 'Lukas Wagner', email: 'lukas@acme.dev', role: 'Viewer', initials: 'LW', status: 'suspended' },
  ]);

  protected readonly activeMembers = computed(
    () => this.members().filter((m) => m.status === 'active').length,
  );
  protected readonly seatUsage = computed(() =>
    Math.round((this.members().length / this.seatLimit()) * 100),
  );

  protected toggleTheme(): void {
    this.isDark.update((dark) => !dark);
    this.document.documentElement.classList.toggle('dark', this.isDark());
  }

  protected badgeVariant(status: Member['status']): 'default' | 'secondary' | 'destructive' {
    switch (status) {
      case 'active':
        return 'default';
      case 'invited':
        return 'secondary';
      case 'suspended':
        return 'destructive';
    }
  }

  protected onSeatLimit(value: number[]): void {
    this.seatLimit.set(value[0]);
  }
}
