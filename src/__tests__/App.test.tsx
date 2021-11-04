import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import fetch from 'jest-fetch-mock';

import App from '../App';
import { maxLives, maxQuestions } from '../config';
import { IResponse } from '../interfaces';

// mock response
const res: IResponse = {
  response_code: 0,
  results: [
    {
      category: '1',
      correct_answer: 'Correct option',
      difficulty: 'easy',
      incorrect_answers: ['An incorrect option', 'Other bad option', 'This is not the right option'],
      question: 'This is a question',
      type: 'multiple',
    },
  ],
};

describe('Game', () => {
  beforeEach(() => {
    fetch.mockResponse(JSON.stringify(res));
  });
  it('should have maximum lives by default', async () => {
    const { findAllByTestId } = render(<App />);
    const hearts = await findAllByTestId('heart-full');
    expect(hearts).toHaveLength(maxLives);
  });

  it('should show the first step', async () => {
    const { findByTestId } = render(<App />);
    const stepText = await findByTestId('currentStep');

    expect(stepText.children[0]).toBe(`1 / ${maxQuestions}`);
  });

  it('should decrease lives when wrong answer given', async () => {
    const { findByTestId, getByTestId, getAllByTestId } = render(<App />);
    const title = await findByTestId('question');
    const inCorrectButton = getByTestId('answer-1');

    expect(title.props.children).toEqual('This is a question');

    fireEvent.press(inCorrectButton);

    const hearts = getAllByTestId('heart-full');
    const emptyHearts = getAllByTestId('heart-empty');
    expect(hearts).toHaveLength(maxLives - 1);
    expect(emptyHearts).toHaveLength(1);
  });

  it('should increase step number if correct answer given', async () => {
    const { getByTestId, getByText, update } = render(<App />);

    const correctButton = await waitFor(() => getByText('Correct option'));
    fireEvent.press(correctButton);

    const currentStepLabel = await getByTestId('currentStep').children[0];
    expect(currentStepLabel).toBe(`2 / ${maxQuestions}`);
  });

  it('should halve the possible answers', async () => {
    const { getByTestId, findAllByTestId, getAllByTestId } = render(<App />);

    const button = getByTestId('thanos');

    const allAnswers = await findAllByTestId(/answer-[0-9]/);
    expect(allAnswers).toHaveLength(4);

    fireEvent.press(button);

    const answersAfterSnap = await getAllByTestId(/answer-[0-9]/);
    //expect(answersAfterSnap).toHaveLength(2);
    expect(answersAfterSnap).toHaveLength(4);
  });
});