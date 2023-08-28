// https://github.com/williamdavis4
// contact
// twitter @will_irs
// instagram @will_irs
// coded from scratch | August, 28, 2023

const { firefox } = require('playwright');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let storedUsername = '';
let mailAccount = '';
let password1 = '';
let paymentEmailAddress = '';
let postcode = '';
let creationMonth = '';
let creationYear = '';
let country = '';
let state = '';
let isp = '';

const promptUsername = () => {
  return new Promise((resolve) => {
    rl.question('Enter username: ', (username) => {
      storedUsername = username;
      resolve(username);
    });
  });
};

const promptMailAccount = () => {
  return new Promise((resolve) => {
    rl.question('Mail.com Account: ', (account) => {
      mailAccount = account;
      resolve(account);
    });
  });
};

const promptPassword1 = () => {
  return new Promise((resolve) => {
    rl.question('Password 1: ', (pass) => {
      password1 = pass;
      resolve(pass);
    });
  });
};

const promptPaymentEmail = () => {
  return new Promise((resolve) => {
    rl.question('Payment Email Address: ', (email) => {
      paymentEmailAddress = email;
      resolve(email);
    });
  });
};

const promptPostcode = () => {
  return new Promise((resolve) => {
    rl.question('Postcode / Zip Code: ', (code) => {
      postcode = code;
      resolve(code);
    });
  });
};

const promptCreationMonth = () => {
  return new Promise((resolve) => {
    rl.question('Creation Month: ', (month) => {
      creationMonth = month;
      resolve(month);
    });
  });
};

const promptCreationYear = () => {
  return new Promise((resolve) => {
    rl.question('Creation Year: ', (year) => {
      creationYear = year;
      resolve(year);
    });
  });
};

const promptCountry = () => {
  return new Promise((resolve) => {
    rl.question('Country: ', (countryInput) => {
      country = countryInput;
      resolve(countryInput);
    });
  });
};

const promptState = () => {
  return new Promise((resolve, reject) => {
    rl.question('State (leave empty if not applicable): ', (stateInput) => {
      if (stateInput.trim() === '') {
        reject();
      } else {
        state = stateInput;
        resolve(stateInput);
      }
    });
  });
};

const promptISP = () => {
  return new Promise((resolve) => {
    rl.question('ISP: ', (ispInput) => {
      isp = ispInput;
      resolve(ispInput);
    });
  });
};

const promptSocksProxy = () => {
  return new Promise((resolve) => {
    rl.question('Enter SOCKS5 proxy (ip:port): ', (proxy) => {
      resolve(proxy);
    });
  });
};

const getRandomMonth = () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[Math.floor(Math.random() * months.length)];
};

const getRandomYear = () => {
  const years = ['2009', '2010', '2011'];
  return years[Math.floor(Math.random() * years.length)];
};

(async () => {
  await promptUsername();
  await promptMailAccount();
  await promptPassword1();
  await promptPaymentEmail();
  await promptPostcode();
  await promptCreationMonth();
  await promptCreationYear();
  await promptCountry();
  
  // Prompt for State (optional)
  await promptState()
    .then(stateInput => {
      state = stateInput;
    })
    .catch(() => {
      // Do nothing if state input is empty or skipped
    });

  await promptISP();
  const proxy = await promptSocksProxy();

  const targetUrl = 'https://secure.runescape.com/m=accountappeal/passwordrecovery';
  const manualRecoveryUrl = 'https://secure.runescape.com/m=accountappeal/manual-recovery';

  const browser = await firefox.launch({
    headless: false,
    proxy: {
      server: `socks5://${proxy}`
    }
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    const selectorToClick = '#CybotCookiebotDialogBodyButtonDecline';
    const intervalMilliseconds = 10000;

    const clickButtonIfVisible = async () => {
      const button = await page.$(selectorToClick);
      if (button) {
        await button.click();
        console.log('Cookie clicked');
        clearInterval(intervalId);

        const emailSelector = '#email';
        await page.fill(emailSelector, storedUsername);
        console.log('Username Typed @ Recovery Page');

        const passwordRecoverySelector = '#passwordRecovery';
        await page.click(passwordRecoverySelector);
        console.log('Username Submitted');
        console.log('Entering Recovery Ticket');

        setTimeout(async () => {
          await page.goto(manualRecoveryUrl);
          console.log('Navigated to manual recovery page');

          // Wait for 10 seconds to let the page load
          await page.waitForTimeout(10000);

          // Fill mailAccount into CSS selectors
          const regEmailSelector = '#reg_email';
          const regEmailConfSelector = '#reg_email_conf';
          await page.fill(regEmailSelector, mailAccount);
          await page.fill(regEmailConfSelector, mailAccount);
          console.log('Filled mailAccount into input fields');

          // Fill password1 into CSS selector
          const password1Selector = '#password1';
          await page.fill(password1Selector, password1);
          console.log('Filled password1 into input field');

          // Click on elements
          await page.click('#recoveries_not_recognised');
          await page.click('label.m-show-password__check-holder:nth-child(1) > input:nth-child(1)');
          console.log('Clicked on recovery elements');

          // Fill paymentEmailAddress into CSS selector
          const emailInputSelector = '#email';
          await page.fill(emailInputSelector, paymentEmailAddress);
          console.log('Filled paymentEmailAddress into input field');

          // Fill postcode into CSS selector
          const postcodeInputSelector = '#postcode';
          await page.fill(postcodeInputSelector, postcode);
          console.log('Filled postcode into input field');

          // Click on #paymenttype and type "credit"
          await page.click('#paymenttype');
          await page.keyboard.type('credit');
          console.log('Clicked on paymenttype and typed "credit"');

          await page.waitForTimeout(1000); // Wait for 1 second

          // Click on #subslength and type "1 month recurring"
          await page.click('#subslength');
          await page.keyboard.type('1 month recurring');
          console.log('Clicked on subslength and typed "1 month recurring"');

          // Click on #earliestsubsmonth and type a random month
          await page.click('#earliestsubsmonth');
          await page.keyboard.type(getRandomMonth());
          console.log('Clicked on earliestsubsmonth and typed a random month');

          // Click on #earliestsubsyear and type a random year
          await page.click('#earliestsubsyear');
          await page.keyboard.type(getRandomYear());
          console.log('Clicked on earliestsubsyear and typed a random year');

          // Click on #creationmonth and type the stored creation month
          await page.click('#creationmonth');
          await page.keyboard.type(creationMonth);
          console.log(`Clicked on creationmonth and typed ${creationMonth}`);

          // Click on #creationyear and type the stored creation year
          await page.click('#creationyear');
          await page.keyboard.type(creationYear);
          console.log(`Clicked on creationyear and typed ${creationYear}`);

          // Click on #country_otherinfo and type the stored country
          await page.click('#country_otherinfo');
          await page.keyboard.type(country);
          console.log(`Clicked on country_otherinfo and typed ${country}`);

          await page.waitForTimeout(1000); // Wait for 1 second

          // Check if the element #state_otherinfo is present (for United States)
          const stateElement = await page.$('#state_otherinfo');
          if (stateElement && state) {
            await stateElement.click();
            await page.keyboard.type(state);
            console.log(`Clicked on state_otherinfo and typed ${state}`);
          }

          // Click on #isp and type the stored ISP
          await page.click('#isp');
          await page.keyboard.type(isp);
          console.log(`Clicked on isp and typed ${isp}`);
        }, 3000);
      }
    };

    const intervalId = setInterval(clickButtonIfVisible, intervalMilliseconds);

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // await browser.close();
  }
})();
