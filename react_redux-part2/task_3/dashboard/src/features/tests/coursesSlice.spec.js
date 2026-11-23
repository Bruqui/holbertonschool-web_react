import mockAxios from 'jest-mock-axios';
import { configureStore } from '@reduxjs/toolkit';
import coursesReducer, {
  fetchCourses,
  selectCourse,
  unSelectCourse,
} from '../courses/coursesSlice';
import { logout } from '../auth/authSlice';

describe('coursesSlice', () => {
  const initialState = {
    courses: [],
  };

  const coursesData = [
    { id: 1, name: 'ES6', credit: 60 },
    { id: 2, name: 'Webpack', credit: 20 },
    { id: 3, name: 'React', credit: 40 },
  ];

  const unselectedCourses = coursesData.map((course) => ({ ...course, isSelected: false }));

  afterEach(() => {
    mockAxios.reset();
  });

  test('returns the correct initial state by default', () => {
    expect(coursesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('fetches courses data correctly with isSelected defaulting to false', async () => {
    const store = configureStore({ reducer: { courses: coursesReducer } });

    const promise = store.dispatch(fetchCourses());

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/courses.json');
    mockAxios.mockResponse({ data: { courses: coursesData } });
    await promise;

    expect(store.getState().courses.courses).toEqual(unselectedCourses);
  });

  test('adds isSelected: false to every course when fetchCourses is fulfilled', () => {
    const state = coursesReducer(initialState, {
      type: fetchCourses.fulfilled.type,
      payload: coursesData,
    });

    expect(state.courses).toEqual(unselectedCourses);
  });

  test('selectCourse sets isSelected to true for the matching course only', () => {
    const state = coursesReducer({ courses: unselectedCourses }, selectCourse(2));

    expect(state.courses).toEqual([
      { id: 1, name: 'ES6', credit: 60, isSelected: false },
      { id: 2, name: 'Webpack', credit: 20, isSelected: true },
      { id: 3, name: 'React', credit: 40, isSelected: false },
    ]);
  });

  test('unSelectCourse sets isSelected to false for the matching course only', () => {
    const selected = unselectedCourses.map((course) => ({ ...course, isSelected: true }));
    const state = coursesReducer({ courses: selected }, unSelectCourse(3));

    expect(state.courses.map(({ isSelected }) => isSelected)).toEqual([true, true, false]);
  });

  test('ignores selectCourse and unSelectCourse for an unknown id', () => {
    const previous = { courses: unselectedCourses };

    expect(coursesReducer(previous, selectCourse(42))).toEqual(previous);
    expect(coursesReducer(previous, unSelectCourse(42))).toEqual(previous);
  });

  test('resets courses to an empty array when logout is dispatched', () => {
    const state = coursesReducer({ courses: unselectedCourses }, logout());

    expect(state.courses).toEqual([]);
    expect(state).toEqual(initialState);
  });
});
