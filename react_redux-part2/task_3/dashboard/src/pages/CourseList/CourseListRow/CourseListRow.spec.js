import { render, screen, within, fireEvent } from '@testing-library/react';
import CourseListRow from './CourseListRow';

const renderRow = (props) =>
  render(
    <table>
      <tbody>
        <CourseListRow textFirstCell="ES6" textSecondCell={60} id={1} {...props} />
      </tbody>
    </table>
  );

describe('CourseListRow checkbox', () => {
  test('renders an unchecked checkbox in a regular row by default', () => {
    renderRow();

    const firstCell = screen.getAllByRole('cell')[0];
    const checkbox = within(firstCell).getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(firstCell).toHaveTextContent('ES6');
  });

  test('does not render a checkbox in header rows', () => {
    render(
      <table>
        <thead>
          <CourseListRow isHeader={true} textFirstCell="Course name" textSecondCell="Credit" />
        </thead>
      </table>
    );

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  test('renders a checked checkbox when isSelected is true', () => {
    renderRow({ isSelected: true });

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('calls onChangeRow with the course id and true when the checkbox is checked', () => {
    const onChangeRow = jest.fn();
    renderRow({ onChangeRow });

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onChangeRow).toHaveBeenCalledTimes(1);
    expect(onChangeRow).toHaveBeenCalledWith(1, true);
  });

  test('calls onChangeRow with the course id and false when the checkbox is unchecked', () => {
    const onChangeRow = jest.fn();
    renderRow({ onChangeRow, isSelected: true });

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onChangeRow).toHaveBeenCalledWith(1, false);
  });

  test('also accepts the handler through the changeRow prop', () => {
    const changeRow = jest.fn();
    renderRow({ changeRow });

    fireEvent.click(screen.getByRole('checkbox'));

    expect(changeRow).toHaveBeenCalledWith(1, true);
  });
});

test('it should display 1 "th" element with colspan=2 when isHeader is true and textSecondCell is null', () => {
  render(
    <table>
      <tbody>
        <CourseListRow isHeader={true} textFirstCell="First" textSecondCell={null} />
      </tbody>
    </table>
  )

  const thElement = screen.getByRole('columnheader');

  expect(thElement).toHaveAttribute('colSpan', '2');
});

test('it should display 2 "th" elements when isHeader is true and textSecondCell is not null', () => {
  render(
    <table>
      <tbody>
        <CourseListRow isHeader={true} textFirstCell="First" textSecondCell="Second" />
      </tbody>
    </table>
  )

  const thElements = screen.getAllByRole('columnheader');

  expect(thElements).toHaveLength(2);
});

test('it should render 2 "td" elements inside a "tr" element when isHeader is false', () => {
  render(
    <table>
      <tbody>
        <CourseListRow isHeader={false} textFirstCell="Data1" textSecondCell="Data2" />
      </tbody>
    </table>
  )

  const trElement = screen.getByRole('row');
  const tdElements = within(trElement).getAllByRole('cell');

  expect(trElement).toBeInTheDocument();
  expect(tdElements).toHaveLength(2);
});
