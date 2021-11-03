import React from 'react';
import { render } from '@testing-library/react-native';
import { Game, IProps } from '../screens';
import { IQuiz } from '../interfaces';

const props: IProps = {
  currentIndex: 0,
  isLoading: false,
  lives: 3,
  questions: [],
  handleAnswerSelected: jest.fn(),
  onResetGame: jest.fn(),
};

jest.mock('../utils/helpers', () => {
  const og = jest.requireActual('../utils/helpers');
  return {
    ...og,
    shuffle: jest.fn((arr: any[]) => arr),
  };
});

describe('Game', () => {
  it('should match snapshot by default', () => {
    const { toJSON } = render(<Game {...props} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with questions', () => {
    const question: IQuiz = {
      category: 'history',
      correct_answer: 'Correct',
      difficulty: 'easy',
      incorrect_answers: ['Incorrect', 'Not correct', 'Wrong'],
      question: 'This is a mock question',
      type: 'multiple',
    };
    const { toJSON } = render(<Game {...props} questions={[question]} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot when loading', () => {
    const { toJSON } = render(<Game {...props} isLoading />);
    expect(toJSON()).toMatchSnapshot();
  });
});
