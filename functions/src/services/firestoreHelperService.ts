import Firestore from './firestoreService';
import Questions from './questionsService';
import Answers from './answersService';
import questions from '../data/questions';
import answers from '../data/answers';

/**
 * @class FirestoreHelper
 */
export default class FirestoreHelper {

    static async fillData(phone: string) {
        console.log('Fill Data --->>>>')
        const questionsMy = questions(phone).my;
        console.log(questionsMy);
        for (const question of questionsMy) {
            await Questions.addQuestion(phone, question.text, question.image);
        }

        const questionsForMe = questions(phone).forMe;
        console.log(questionsForMe);
        for (const answer of questionsForMe) {
            const questionRefs = await Questions.addQuestion(answer.question.fromPhone, answer.question.text, answer.question.image);
            const data = {
                toPhone: answer.toPhone,
                questionRef: await Firestore.getFirestore().doc('questions/' + questionRefs.id),
                text: '',
                image: '',
            };
            await Answers.addAnswer(data);
        }

        const answersMy = answers(phone).my;
        console.log(answersMy);
        for (const answer of answersMy) {
            const questionRefs = await Questions.addQuestion(answer.question.fromPhone, answer.question.text, answer.question.image);
            const data = {
                toPhone: answer.toPhone,
                questionRef: await Firestore.getFirestore().doc('questions/' + questionRefs.id),
                text: answer.text,
                image: answer.image,
            };
            await Answers.addAnswer(data);
        }

        const answersForMe = answers(phone).forMe;
        console.log(answersForMe);
        for (const answer of answersForMe) {
            const questionRefs = await Questions.addQuestion(answer.question.fromPhone, answer.question.text, answer.question.image);
            const data = {
                toPhone: answer.toPhone,
                questionRef: await Firestore.getFirestore().doc('questions/' + questionRefs.id),
                text: answer.text,
                image: answer.image,
            };
            await Answers.addAnswer(data);
        }

    }
};