import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-dropdown.component.html',
  styleUrl: './custom-dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true,
    },
  ],
})
export class CustomDropdownComponent implements OnChanges, ControlValueAccessor  {
  @Input() options!: any[] | []; // Input for dropdown options
  @Input() placeholder!: string; // placeholder
  dropdownVisible = false;
  searchTerm: string = ''; // Variable for search term
  filteredOptions: string[] = []; // List to hold filtered options

  private _value: string = ''; // Value of the dropdown
  private onChange: any = () => { }; // Function to call on value change
  private onTouched: any = () => { }; // Function to call when touched

  ngOnChanges(changes: SimpleChanges): void {
    if (this.options) {
      this.filteredOptions = [...this.options ?? []]; // Initialize with all options
    }
  }

  // Write a new value to the control (set value in form)
  writeValue(value: string): void {
    if (value) {
      this._value = value;
      this.searchTerm = this._value.split('_')[1];
      this.onSearch(); // Re-filter options if value is set programmatically
    }
  }

  // Register a function to call when the value changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Register a function to call when the control is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Filter options based on search input
  onSearch() {
    this.filteredOptions = this.options.filter(option =>
      option.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Emit the selected option and update the form control
  onSelect(option: string) {
    this._value = option;
    this.onChange(option); // Notify Angular form of value change
    this.searchTerm = this._value.split('_')[1]; // Clear search term after selection
    this.filteredOptions = [...this.options]; // Reset options
  }

  toggleDropdown(visible: boolean) {
    setTimeout(() => {
      this.dropdownVisible = visible;
    }, 100); // Delay to prevent immediate close when selecting
  }

  // Getter for current value
  get value(): string {
    return this._value;
  }

  // Setter for value
  set value(val: string) {
    this._value = val;
    this.onChange(val);
  }
}
