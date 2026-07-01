import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from './components/switch/switch.component';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { SelectComponent } from './components/select/select.component';
import { BooleanComponent } from './components/boolean/boolean.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TableFiltersComponent } from './components/table-filters/table-filters.component';
import { CelularMaskDirective } from './directive/celular-mask-directive';
import { CepMaskDirective } from './directive/cep-mask-directive';
import { CnpjMaskDirective } from './directive/cnpj-mask-directive';
import { TelefoneMaskDirective } from './directive/telefone-mask-directive';
import { TelefonePipe } from './pipes/telefonepipe.pipe';
import { CnpjPipe } from './pipes/cnpjpipe.pipe';
import { CelularPipe } from './pipes/celularpipe.pipe';
import { Confirmation } from './modals/confirmation/confirmation';
import { NotificationComponent } from './modals/notification/notification';

@NgModule({
  declarations: [
    ButtonComponent,
    SwitchComponent,
    InputComponent,
    DatePickerComponent,
    SelectComponent,
    BooleanComponent,
    PaginationComponent,
    TableFiltersComponent,
    CelularMaskDirective,
    CepMaskDirective,
    CnpjMaskDirective,
    TelefoneMaskDirective,
    TelefonePipe,
    CnpjPipe,
    CelularPipe,
    Confirmation,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    SwitchComponent,
    InputComponent,
    DatePickerComponent,
    SelectComponent,
    BooleanComponent,
    PaginationComponent,
    TableFiltersComponent,
    CelularMaskDirective,
    CepMaskDirective,
    CnpjMaskDirective,
    TelefoneMaskDirective,
    TelefonePipe,
    CnpjPipe,
    CelularPipe,
    Confirmation,
    NotificationComponent
  ]
})
export class SharedModule {}
