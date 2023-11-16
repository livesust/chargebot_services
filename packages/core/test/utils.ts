
import { faker } from '@faker-js/faker';

export const getRandom = (type: string, lenght = 10): any => {
    if (['text', 'varchar(10)', 'varchar(50)', 'varchar(100)', 'varchar(255)'].includes(type)) {
        return faker.lorem.word(lenght);
    } else if (['integer', 'bigint'].includes(type)) {
        return faker.number.bigInt();
    } else if (['float', 'decimal'].includes(type)) {
        return faker.number.float();
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