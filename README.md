# Scroll Wheel Tester

A browser page that tests a mouse scroll wheel for hardware faults. Nothing to install: open the page, roll the wheel, read the verdict.

**Open it:** https://sirsnipesalot.github.io/scroll-wheel-tester/

It needs a desktop or laptop with the mouse you want to test.

## What it finds

People scroll in finger strokes: a few notches, a pause while the finger comes back, then the next stroke. The tester splits the wheel events into those strokes and judges every wrong-way event by where it falls in a stroke.

| Lamp | What happened | How sure |
| --- | --- | --- |
| Reversed | An event against the roll in the middle of a stroke | Certain |
| Bounce-back | An event against the roll straight after the last notch of a stroke | Certain |
| False start | An event against the roll just before a stroke gets going | Certain |
| Hands off | The wheel reported movement while nobody touched it | Certain |
| Back-step | One slow event against the roll between two strokes | Suspect: it can be the finger dragging the wheel back |
| On click | Wheel events that arrived as the wheel button was pressed | Suspect: pressing can nudge the wheel |

It also shows:

- **Coverage.** How much rolling each direction has had at four speeds: single notches, slow rolls, normal strokes and fast flicks. Faults often show at one speed only, so the verdict stays at "clean so far" until all eight are covered.
- **Three checks** that need you to take part:
  - *Notches per turn.* Mark the wheel, roll whole turns, and the count per turn falls out.
  - *Counted notches.* Roll exactly ten clicks by feel. Nine or eleven on screen means dropped or doubled notches.
  - *Hands off.* Ten seconds without touching the wheel. Anything it reports, it is doing by itself.
- **Wheel map.** A dial of one turn of the wheel with a dot wherever a fault fell.
- **Copy report.** A plain-text summary to paste into a support ticket or a return request.
- **Copy CSV.** Every recorded event, for your own analysis.

## Using it

1. Open the page and scroll the way you normally do, anywhere on it.
2. Try single notches, slow rolls and fast flicks, in both directions, until the coverage strip fills.
3. Run the three checks on the right.
4. Read the verdict lamp. The lamps next to it say which kinds of fault were seen.

Keys: `Space` pause (this also gives the wheel back to the page), `R` reset, `F` full screen, `T` `C` `H` start the three checks, `Enter` finish a check, `Esc` cancel one.

In Chrome or Edge you can install it as an app from the address bar. Once installed it opens in its own window and works offline.

## Before you blame the wheel

Blow the wheel out with compressed air, close the mouse maker's software or turn off its smooth scrolling, plug in directly instead of through a hub, and try another port or another computer. A fault that follows the mouse is the mouse.

## How it decides

- **Strokes.** A pause longer than 130 ms separates two strokes. Measured notch intervals are bimodal with the dip just above 100 ms ([Hinckley et al. 2002](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/Scrolling_CHI02.pdf)), and a finger stroke turns the wheel 2 to 7 notches ([Atkins et al. 2009](https://www2.cs.sfu.ca/~stella/papers/2009/jdi.pdf)).
- **Certain faults.** A change of direction within 60 ms is treated as the wheel, not the finger. This number is a judgement: nobody has published how fast a person can reverse a wheel. Encoder chatter is specified at about 10 ms ([ALPS EC10E datasheet](https://tech.alpsalpine.com/e/products/detail/EC10E1220501/)).
- **Notch counting.** Where the browser reports the legacy `wheelDelta`, one notch is 120 whatever the scroll settings or zoom, so several notches merged into one event are still counted correctly.
- **High-resolution wheels.** These send several events per notch and step back slightly as they settle ([Linux Logitech driver](https://github.com/torvalds/linux/blob/master/drivers/hid/hid-logitech-hidpp.c), [libinput](https://wayland.freedesktop.org/libinput/doc/latest/wheel-api.html)). The tester detects them and stops calling those back-steps faults.

All the thresholds sit in one `CFG` block at the top of the script in `index.html`.

## Limits

- A web page sees wheel events after the operating system and browser have processed them. It cannot see the encoder's raw signals, tell two mice apart, or record while the page is in the background.
- Chrome hands over wheel events once per screen frame and adds up what arrived in between ([details](https://developer.chrome.com/blog/aligning-input-events)), so in a fast flick a stray can cancel against a real notch. Slow, steady rolling exposes the most.
- The reading of the wheel map as "one bad spot on the wheel" is a hypothesis, not an established failure mode.
- Detection has been checked against simulated wheel input. Reports from real faulty wheels are welcome.

## Running it yourself

Everything is in `index.html`. There is no build step and nothing to install; the only outside resources are two Google Fonts. Open the file in a browser, or serve the folder with any static file server. `sw.js` and `manifest.webmanifest` only matter when the page is served over HTTPS.

## Licence

GNU General Public License v3.0. See [LICENSE](LICENSE).
