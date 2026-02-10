import { type ReactNode, useRef } from "react";
import {
  useButton,
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
  useLocale,
} from "react-aria";
import { useCalendarState } from "react-stately";
import {
  createCalendar,
  getLocalTimeZone,
  getWeeksInMonth,
  isSameDay,
  startOfWeek,
  today,
} from "@internationalized/date";

type CalendarProps = {
  value?: any;
  defaultValue?: any;
  minValue?: any;
  maxValue?: any;
  onChange?: (value: any) => void;
  className?: string;
  headerClassName?: string;
  gridClassName?: string;
  cellClassName?: string;
  navigationClassName?: string;
  prevButtonClassName?: string;
  nextButtonClassName?: string;
  titleClassName?: string;
  children?: ReactNode;
};

export function Calendar({
  className,
  headerClassName,
  gridClassName,
  cellClassName,
  navigationClassName,
  prevButtonClassName,
  nextButtonClassName,
  titleClassName,
  ...props
}: CalendarProps) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    locale,
    createCalendar,
    visibleDuration: { months: 1 },
    defaultValue: props.defaultValue ?? today(getLocalTimeZone()),
  });
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const { buttonProps: prevProps } = useButton(prevButtonProps, prevRef);
  const { buttonProps: nextProps } = useButton(nextButtonProps, nextRef);

  return (
    <div {...calendarProps} className={className}>
      <div className={headerClassName}>
        <div className={navigationClassName}>
          <button {...prevProps} ref={prevRef} className={prevButtonClassName}>
            ‹
          </button>
          <span className={titleClassName}>{title}</span>
          <button {...nextProps} ref={nextRef} className={nextButtonClassName}>
            ›
          </button>
        </div>
      </div>
      <CalendarGrid state={state} className={gridClassName} cellClassName={cellClassName} />
    </div>
  );
}

type CalendarGridProps = {
  state: ReturnType<typeof useCalendarState>;
  className?: string;
  cellClassName?: string;
};

function CalendarGrid({ state, className, cellClassName }: CalendarGridProps) {
  const ref = useRef<HTMLTableElement>(null);
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid({}, state, ref);
  const { locale } = useLocale();
  const startDate = state.visibleRange.start;
  const weeks = [];
  const startOfFirstWeek = startOfWeek(startDate, locale);
  const totalWeeks = weeksInMonth || getWeeksInMonth(startDate, locale);

  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex += 1) {
    const week = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      week.push(startOfFirstWeek.add({ days: weekIndex * 7 + dayIndex }));
    }
    weeks.push(week);
  }

  return (
    <table {...gridProps} ref={ref} className={className}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day) => (
            <th key={day}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((date, index) => (
              <CalendarCell key={index} state={state} date={date} className={cellClassName} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type CalendarCellProps = {
  state: ReturnType<typeof useCalendarState>;
  date: any;
  className?: string;
};

function CalendarCell({ state, date, className }: CalendarCellProps) {
  const ref = useRef<HTMLTableCellElement>(null);
  const { cellProps, buttonProps, isSelected, isDisabled, isOutsideVisibleRange } = useCalendarCell(
    { date },
    state,
    ref
  );

  const isToday = isSameDay(date, today(getLocalTimeZone()));

  return (
    <td {...cellProps} ref={ref} className={className} data-outside={isOutsideVisibleRange || undefined}>
      <button
        {...buttonProps}
        type="button"
        data-selected={isSelected || undefined}
        data-disabled={isDisabled || undefined}
        data-today={isToday || undefined}
      >
        {date.day}
      </button>
    </td>
  );
}
