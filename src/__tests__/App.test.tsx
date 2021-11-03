import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import App from '../App';
import { maxLives, maxQuestions } from '../config';
import { IResponse } from '../interfaces';
import fetch from 'jest-fetch-mock';

const mockResponse: IResponse = {
  response_code: 0,
  results: [
    {
      category: 'history',
      correct_answer: 'Correct',
      difficulty: 'easy',
      incorrect_answers: ['Incorrect', 'Not correct', 'Wrong'],
      question: 'This is a mock question',
      type: 'multiple',
    },
  ],
};

describe('App', () => {
  beforeEach(() => {
    fetch.mockResponse(JSON.stringify(mockResponse));
  });
  it('should have maximum lives by default', async () => {
    const { findAllByTestId } = render(<App />);
    const hearts = await findAllByTestId('heart-full');

    expect(hearts).toHaveLength(maxLives);
  });

  it('should show the first step', async () => {
    const { findByTestId } = render(<App />);

    const currentStep = await findByTestId('currentStep');

    expect(currentStep.props.children).toBe(`1 / ${maxQuestions}`);
  });

  it('should decrease lives when press wrong answer', async () => {
    const { findByTestId, getAllByTestId, getByText } = render(<App />);
    const title = await findByTestId('question');
    expect(title.props.children).toBe('This is a mock question');

    const incorrectButton = getByText('Incorrect');

    fireEvent.press(incorrectButton);

    const hearts = getAllByTestId('heart-full');
    const emptyHearts = getAllByTestId('heart-empty');
    expect(hearts).toHaveLength(maxLives - 1);
    expect(emptyHearts).toHaveLength(1);
  });

  it('should increase step number when correct answer given', async () => {
    const { getByText, getByTestId } = render(<App />);
    const correctButton = await waitFor(() => getByText('Correct'));

    fireEvent.press(correctButton);

    waitFor(() =>
      expect(getByTestId('currentStep').props.children).toBe(
        `2 / ${maxQuestions}`
      )
    );
  });

  it('should halve the available questions', async () => {
    const { findAllByTestId, getByTestId } = render(<App />);
    const allAnwsers = await findAllByTestId(/answer-[0-9]/);
    expect(allAnwsers).toHaveLength(4);

    const button = getByTestId('thanos');

    fireEvent.press(button);
    fireEvent.press(button);

    const remainingAnswers = await findAllByTestId(/answer-[0-9]/);
    expect(remainingAnswers).toHaveLength(2);
  });
});
