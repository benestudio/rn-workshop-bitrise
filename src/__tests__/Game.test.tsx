import { render } from '@testing-library/react-native';
import React from 'react';
import { IQuiz } from '../interfaces';
import { Game } from '../screens';
import { IProps } from '../screens/Game';

const props: IProps = {
    currentIndex: 0,
    isLoading: false,
    lives: 3,
    questions: [],
    handleAnswerSelected: jest.fn(),
    onResetGame: jest.fn(),
}

describe('Game', () => {
    it('should match snapshot by default', () => {
        const { toJSON } = render(<Game {...props} />);
        expect(toJSON()).toMatchSnapshot();

    });

    it('should match snapshot while loading', () => {
        const { toJSON } = render(<Game {...props} isLoading />);
        expect(toJSON()).toMatchSnapshot();
    })
    it('should match snapshot with questions', () => {
        const question: IQuiz = {
            category: "asdf",
            type: 'multiple',
            difficulty: 'easy',
            question: "Question",
            correct_answer: "answer",
            incorrect_answers: ["answer 2"],
        };
        const { toJSON } = render(<Game {...props} questions={[question]} />);
        expect(toJSON()).toMatchSnapshot();
    })
});
