# ChatLibs
ChatLibs is an app inspired by the classic template word game Mad Libs and uses ChatGPT to generate templates. 

**Link to project:** https://chatlibs.cyclic.app/


<img width="584" alt="chatlibs-screenshot" src="https://github.com/a-rud017/chat-libs/assets/109028773/6010d259-ae48-4e0f-bb4c-c9a66dd63b58">


## How It's Made:

**Tech used:** EJS, CSS, JavaScript, Node.js, Express, Web Speech API

ChatLibs uses Node and Express on the back end to generate the templates. EJS is used to render the templates for the user to fill out inputs. After the user submits a filled out template, the Web Speech API is used to speak the template out loud to the user. Users are able to select from a list of voices available with their browser. 

## Optimizations

- [X] Add stop and resume buttons
- [ ] Add more templates
- [ ] Add options for user to change voice speed/inflection
- [ ] Highlight text as it's being spoken
- [ ] Use ChatGPT API to generate infinite templates
- [ ] Option for users to add their own template


## Lessons Learned:

I ran into some difficulties getting the Web Speech API to load properly for different browsers but was able to solve this by using a setTimeout to delay until all available voices for each browser are loaded. 

Since ChatGPT API is not free I had to pre-generate templates and store them in the backend of my app to load them for users. In the future I would like to use ChatGPT API to generate templates in real-time and have an infinite amount of templates available for users. 
