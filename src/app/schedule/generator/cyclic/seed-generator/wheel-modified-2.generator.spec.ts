import { runCyclicGeneratorSuite } from '../testing/cyclic-generator.suite';
import { wheelModifiedTwoGenerator } from './wheel-modified-2.generator';

runCyclicGeneratorSuite(wheelModifiedTwoGenerator, [16, 32]);
