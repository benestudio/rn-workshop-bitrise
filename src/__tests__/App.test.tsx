import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import App from '../App';
import { maxLives, maxQuestions } from '../config';
import fetch from 'jest-fetch-mock';
import { IResponse } from '../interfaces';

const mockResponse: IResponse = {
    response_code: 0,
    results: [
        {
            category: "asdf",
            type: 'multiple',
            difficulty: 'easy',
            question: "Question",
            correct_answer: "answer",
            incorrect_answers: ["answer 2"],
        }
    ]
}
describe('App', () => {

    beforeEach(() => {
        fetch.mockResponse(JSON.stringify(mockResponse));
    })
    it('should have full life', async () => {
        const { findAllByTestId } = render(<App />);
        const hearts = await findAllByTestId('heart-full');

        expect(hearts).toHaveLength(maxLives);
    });

    it('should show first step', async () => {
        const { findByTestId } = render(<App />);
        const currentStep = await findByTestId('currentStep');
        expect(currentStep.props.children).toEqual(`1 / ${maxQuestions}`);
    })

    it('should decrease lives when incorrect selected', async () => {
        const { findByTestId, getByText, getAllByTestId } = render(<App />);

        const question = await findByTestId('question');

        expect(question.props.children).toEqual('Question');

        const incorrectButton = getByText('answer 2');

        fireEvent.press(incorrectButton)

        const hearts = getAllByTestId('heart-full');
        const emptyHearts = getAllByTestId('heart-empty');
        
        expect(hearts).toHaveLength(2);
        expect(emptyHearts).toHaveLength(1);
    });

    it('should increase stepCounter if correct answer selected', async () => {
        const { getByText, getByTestId } = render(<App />);
        
        const correctButton = await waitFor(() => getByText("answer"));

        fireEvent.press(correctButton);

        const nextStep = getByTestId('currentStep');

        expect(nextStep.props.children).toEqual(`2 / ${maxQuestions}`);
    });
});
