// ==UserScript==
// @name         Copy Blocked users twitter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://twitter.com/settings/blocked/all
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

const common_bios = [
    "Here we sell items for daily use in the household, utility items, decorations",
    "Online store selling items for everyday household needs",
    "The store sells decorative items, household items for daily use",
    "We are an online store, selling everyday household items, toys",
  ];
  var usernames = [];
  var lastScrollPosition = 0;
  
  (function () {
    "use strict";
  
    // Wait for the page to load completely
    window.addEventListener("load", function () {
      const observer = new MutationObserver(function (mutationsList) {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList") {
            let blocked_users_section = document.querySelector("section");
            if (blocked_users_section) {
              var button = document.createElement("button");
              button.textContent = "Copy usernames";
              button.addEventListener("click", handleButtonClick);
              blocked_users_section.parentNode.insertBefore(
                button,
                blocked_users_section
              );
              observer.disconnect(); // Stop observing once the element is found
              break;
            }
          }
        }
      });
  
      // Start observing the DOM changes
      observer.observe(document.body, { childList: true, subtree: true });
    });
  })();
  
  function handleButtonClick(event) {
    usernames = []; // Reset usernames array
    scrollDown(); // Start scrolling and extracting usernames
  }
  
  function scrollDown() {
    let previousScrollPosition = window.scrollY;
    window.scrollBy(0, window.innerHeight); // Scroll down
    let currentScrollPosition = window.scrollY;
    if (previousScrollPosition === currentScrollPosition) {
      // Reached the bottom, stop scrolling
      copyUsernamesToClipboard();
      return;
    } else {
      lastScrollPosition = currentScrollPosition;
    }
    setTimeout(extractUsernames, 2000); // Extract usernames after scrolling
  }
  
  function extractUsernames() {
    document.querySelectorAll("div[data-testid=cellInnerDiv]").forEach((user) => {
      let bioText = user.textContent.trim();
      if (common_bios.some((commonBio) => bioText.includes(commonBio))) {
        let links = user.querySelectorAll("a");
        if (links.length > 0) {
          let lastLink = links[links.length - 1];
          let username = lastLink.textContent.trim();
          usernames.push(username);
        }
      }
    });
    scrollDown(); // Continue scrolling to load more usernames
  }
  
  function copyUsernamesToClipboard() {
    usernames = Array.from(new Set(usernames));
  
    if (usernames.length > 0) {
      const usernamesString = usernames.join("\n");
      navigator.clipboard
        .writeText(usernamesString)
        .then(() => {
          console.log("Usernames copied to clipboard:", usernamesString);
          alert("Usernames copied to clipboard:\n" + usernamesString);
        })
        .catch((error) => {
          console.error("Failed to copy usernames to clipboard:", error);
          alert("Failed to copy usernames to clipboard. Please try again.");
        });
    } else {
      console.log("No usernames found with common bios.");
      alert("No usernames found with common bios.");
    }
  }
  