import { RouterOutputs } from "../src/utils/api";
type Card = RouterOutputs["card"]["getSchema"];

export function addDaysToCardReviewDate(card: Card, daysToAdd: number): Card {
    if(!card) {
        throw new Error("Error adding days to card review date: card is null");
    }
    const newReviewDate = setZeroTime(addDaysToReviewDate(card.reviewDate, daysToAdd));
    return {
        ...card,
        reviewDate: newReviewDate,
    } as Card;
}

export function dateDifferenceInDays(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date1.getTime() - date2.getTime());
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
}

export function addDaysToReviewDate(reviewDate: Date, daysToAdd: number): Date {
    const newReviewDate = setZeroTime(new Date(reviewDate.getTime()));
    newReviewDate.setDate(newReviewDate.getDate() + daysToAdd);
    return newReviewDate;
}

export function addOneDay(reviewDate: Date): Date {
    return addDaysToReviewDate(reviewDate, 1);
}

export function subtractOneDay(reviewDate: Date): Date {
    return addDaysToReviewDate(reviewDate, -1);
}

export function setZeroTime(date: Date): Date {
    return new Date(date.setUTCHours(0, 0, 0, 0));
}

export function hasZeroTime(date: Date): boolean {
    return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
}

