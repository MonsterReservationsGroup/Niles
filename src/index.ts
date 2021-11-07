#! /usr/bin/env node
import { defaultVerb } from './Logic/DefaultVerb/DefaultVerb.PAPI';
import { create } from './Logic/Create/Create.PAPI';

// <-- Import End -->

const verb = process.argv[2];

// <-- Variable Definition End -->

(async function main() {
  switch (verb) {
    case 'create':
      create();
      break;
    default:
      defaultVerb();
      break;
  }
})();
