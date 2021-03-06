import { resolve } from 'path';
import { config } from 'dotenv';
import {
  retriveCommitStats,
  retriveUserStats,
  retrieveMostUsedLanguages,
  retrieveRecentlyPush
} from './service';
import * as fs from 'fs';
import { createMarkerRegExp } from './util';

/**
 * get environment variable
 */
config({ path: resolve(__dirname, '../.env') });


(async () => {

  let mdContent = fs.readFileSync('README.md', { encoding: 'utf-8' }).toString();

  // user stas query
  const userStats =  await retriveUserStats();
  console.log(userStats);
  let matchResult = mdContent.match(createMarkerRegExp('github stats'));
  if (Array.isArray(matchResult) && matchResult.length > 0 && userStats) {
    mdContent = mdContent.replace(matchResult[1], userStats);
  }

  // commit stats
  const commitStat = await retriveCommitStats();
  console.log(commitStat);
  matchResult = mdContent.match(createMarkerRegExp('Commit stats'));
  if (Array.isArray(matchResult) && matchResult.length > 0 && commitStat) {
    mdContent = mdContent.replace(matchResult[1], commitStat);
  }

  // Most Used Languages
  const mostUsedLanguages = await retrieveMostUsedLanguages();
  console.log(mostUsedLanguages);
  matchResult = mdContent.match(createMarkerRegExp('Most Used Language'));
  if (Array.isArray(matchResult) && matchResult.length > 0 && mostUsedLanguages) {
    mdContent = mdContent.replace(matchResult[1], mostUsedLanguages);
  }

  // Recently Push
  const recentlyPushed = await retrieveRecentlyPush();
  console.log(recentlyPushed);
  matchResult = mdContent.match(createMarkerRegExp('Recent Pushed'));
  if (Array.isArray(matchResult) && matchResult.length > 0 && recentlyPushed) {
    mdContent = mdContent.replace(matchResult[1], recentlyPushed);
  }


  fs.writeFileSync('README.md', mdContent, { encoding: 'utf-8' });
})();

