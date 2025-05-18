# Note

Old frontend used htmx and alpine.js

But these restricted the design a lot compared to state based frontend frameworks like react. Especially for the chatbox part which normally uses a lot of components to compose each part. This is as HTMX while simple usually works via DOM swapping. 

# Requirements

Could you help me code htmx, alpine.js and tailwind css based frontend for my app called openreporting - where it uses jinja like placeholders based docx (docxpl), yaml configuration for deciding subsitution behaviour and a chatbot to gather details.


the main pages of this web app are:
1) Home page dashboard
2) Chatbot, some of the chat logic might be either hardcoded or dynamic (LLM generated)
3) Yaml config editor - either you a) import config b) export config (as yaml file) c) save config (i.e on server) d) preview config (uses a docx previewer to show fields subsituted with behaviour. Basically once you upload a docx with the jinja variables, it will be scanned through and listed out as a table for user to pick. There are a few types of subsitution types - e.g date time, dynamic, static. Static means user has to enter the field explicitly which will happen in the chatbot as form like fields. Dynamic will allow to set a prompt which can be used to customize behaviour of chatbot to prompt or guide user to give the relevant details, and also to format the final output for rendering in docx (e.g bullet points). Date time and other default types are just sensible and common defaults. If variable has the special name, then it gets auto subsituted if already set in settings. The same variables can appear multiple times in the document, as some fields are filled exactly the same,  but in this config editor it should be deduped.
4) Settings - also for setting some special jinja variables like email, name of user, address. ALlows toggling of experimental behaviour like using RAG (for now it won't be on), and validator agents for formatting.

However, this webapp will work like an single page application. e.g setting is in an overlay card (with blur of the background). Only chatbot and yaml config are separate pages. I'm not sure what other pages I would need - maybe you can suggest for me.

I also need a dark/light mode toggle

## Chatbot.html userflow

Okay now chatbot.html. Also dark mode is still broken but less of a priority and my openreporting icon is kinda compressed is the sidebar lol, i would prefer some behaviour to have the full icon of openreporting, unless its too small then use a smaller icon (e.g a stylised O for now as a placeholder)

My special requirement vs a normal chatbot is that some parts of the conversation especially the beginning will allow users to fill in some static fields, These static fields have help/guide to explain what these fields is. They also can come with sensible default values if they are special values e.g email, date time, tables but can still be hand adjusted even if so. Some special types that have special treatment using LLM but are not dynamic are like summary (i.e after the rest of the form is filled the LLM reads through one more time and then does an executive summary). Table types are special types that can have variable number of items inside, so on the chatbot side they have a way to "+" new rows if needed. 


later on for dynamic parts of the document the user will enter a conversation for each dynamic part - until the llm decides that it has enough information to populate the field. There should be a relatively clear demarcation between the different dynamic fields - e.g ------ Gathering information on "finances" -------

You can stub based on this userflow for now.
So the userflow is:
User enters a new conversation to make a new report
They select which config to use (if saved or is preset) - a config is both the yaml and a docx template.

The chat then begins, and the user is first prompted to fill in the static fields in a form. There is a small hover help that explains what the field wants. If the config has a default value or is a special variable its filled with that value, this can be used to aid users to figure out what is a valid value to fill in.

then the chatbot collects information for each dynamic field. It starts with the first dynamic field - chats with the user (based on its system prompt in the config), and when it thinks it has enough it will ask for confirmation from the user to subsitute that content into the field.

Then it goes onto the next dynamic field and does the same thing.

When it reaches the end of all the fields, it will do one last summary, ask for confirmation, and then allow the user to download the report. 

if the user is still not satisfied they can continue asking the chatbot to fix somethings.


Also - it needs to be possible for the user to copy field values from conversations using the same templates. This is as some reports have almost the exact same values as before with some small content modification.
