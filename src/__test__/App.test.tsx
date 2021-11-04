import React from "react";
import App from "../App";
import { render } from '@testing-library/react-native';
import { maxLives } from "../config";
import fetch from 'jest-fetch-mock';
import { IResponse } from '../interfaces';

const mockResponse: IResponse = {
    response_code: 0,
    results: [{
        'type': 'boolean',
        'category': '',
        'difficulty': 'easy',
        'question': '?',
        'correct_answer': "ok",
        'incorrect_answers': ["no"]
    }]
}

describe(App, () => {
    beforeEach(() => {
        fetch.mockResponse(JSON.stringify(mockResponse))
    })
    it('should all lives by default', async () => {
        const { findAllByTestId } = render(<App />);
        const hearts = await findAllByTestId('heart-full');
        expect(hearts).toHaveLength(maxLives);
    })
    it('should first step text', async () => {
        const { findAllByTestId } = render(<App />);
        const hearts = await findAllByTestId('heart-full');
        expect(hearts).toHaveLength(maxLives);
    })
    it('should decrease live in case a wrong answer', async () => {
        const { findAllByTestId } = render(<App />);
        const question = await findAllByTestId('question');
        //expect(question.props.children).toEqual('do you enjoy this workshop');
    })
})