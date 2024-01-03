import 'jest-preset-angular/setup-jest';

// Needed until jsdom supports showPopover
HTMLElement.prototype.showPopover = jest.fn();
