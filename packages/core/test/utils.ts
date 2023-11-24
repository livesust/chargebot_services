
import { faker } from '@faker-js/faker';

export const getRandom = (type: string, length = 10) => {
    if (['text', 'varchar'].includes(type)) {
        return faker.string.alpha({ length: { min: 1, max: length } });
    } else if (['integer', 'bigint'].includes(type)) {
        return faker.number.int({ min: 1, max: 100 });
    } else if (['float', 'decimal'].includes(type)) {
        return faker.number.float({ min: 1, max: 100, precision: 2 });
    } else if (['timestamp', 'timestamptz'].includes(type)) {
        return faker.date.past();
    } else if (type === 'uuid') {
        return faker.string.uuid();
    } else if (type === 'json') {
        return {
            "prop1": faker.lorem.word(10),
            "prop2": faker.lorem.word(10)
        };
    } else if (type === 'boolean') {
        return faker.datatype.boolean()
    }
}