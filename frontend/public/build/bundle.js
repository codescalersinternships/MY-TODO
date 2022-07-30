
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_options(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            option.selected = ~value.indexOf(option.__value);
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function select_multiple_value(select) {
        return [].map.call(select.querySelectorAll(':checked'), option => option.__value);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind$1(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/footer/Footer.svelte generated by Svelte v3.49.0 */

    const file$g = "src/components/footer/Footer.svelte";

    function create_fragment$h(ctx) {
    	let footer;
    	let ul0;
    	let li0;
    	let a0;
    	let i0;
    	let t0;
    	let li1;
    	let a1;
    	let i1;
    	let t1;
    	let li2;
    	let a2;
    	let i2;
    	let t2;
    	let li3;
    	let a3;
    	let i3;
    	let t3;
    	let li4;
    	let a4;
    	let i4;
    	let t4;
    	let ul1;
    	let li5;
    	let a5;
    	let t6;
    	let li6;
    	let a6;
    	let t8;
    	let li7;
    	let a7;
    	let t10;
    	let li8;
    	let a8;
    	let t12;
    	let p0;
    	let t13;
    	let i5;
    	let t14;
    	let t15;
    	let p1;
    	let t16;
    	let script;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			ul0 = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			i0 = element("i");
    			t0 = space();
    			li1 = element("li");
    			a1 = element("a");
    			i1 = element("i");
    			t1 = space();
    			li2 = element("li");
    			a2 = element("a");
    			i2 = element("i");
    			t2 = space();
    			li3 = element("li");
    			a3 = element("a");
    			i3 = element("i");
    			t3 = space();
    			li4 = element("li");
    			a4 = element("a");
    			i4 = element("i");
    			t4 = space();
    			ul1 = element("ul");
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "Documentation";
    			t6 = space();
    			li6 = element("li");
    			a6 = element("a");
    			a6.textContent = "About";
    			t8 = space();
    			li7 = element("li");
    			a7 = element("a");
    			a7.textContent = "Home";
    			t10 = space();
    			li8 = element("li");
    			a8 = element("a");
    			a8.textContent = "Privacy & Policy";
    			t12 = space();
    			p0 = element("p");
    			t13 = text("Made with ");
    			i5 = element("i");
    			t14 = text(" by Omar Sherif ALi -\n    OSA");
    			t15 = space();
    			p1 = element("p");
    			t16 = text("Copyright OSA ©\n    ");
    			script = element("script");
    			script.textContent = "document.write(new Date().getFullYear());";
    			attr_dev(i0, "class", "fab fa-youtube");
    			add_location(i0, file$g, 6, 24, 181);
    			attr_dev(a0, "href", "https://www.youtube.com/channel/UCt0eXFStNA2oX5AqMjIBprw");
    			attr_dev(a0, "data-placement", "top");
    			attr_dev(a0, "title", "Youtube");
    			attr_dev(a0, "class", "svelte-92yret");
    			add_location(a0, file$g, 3, 6, 53);
    			attr_dev(li0, "class", "svelte-92yret");
    			add_location(li0, file$g, 2, 4, 42);
    			attr_dev(i1, "class", "fas fa-portrait icon");
    			add_location(i1, file$g, 13, 19, 367);
    			attr_dev(a1, "href", "https://mega.nz/folder/FggAUAID#aF5qbxVjUfosGTxufJYxRQ");
    			attr_dev(a1, "data-placement", "top");
    			attr_dev(a1, "title", "CV");
    			attr_dev(a1, "class", "svelte-92yret");
    			add_location(a1, file$g, 10, 6, 246);
    			attr_dev(li1, "class", "svelte-92yret");
    			add_location(li1, file$g, 9, 4, 235);
    			attr_dev(i2, "class", "fab fa-github icon");
    			add_location(i2, file$g, 20, 23, 543);
    			attr_dev(a2, "href", "https://github.com/omar-sherif9992");
    			attr_dev(a2, "data-placement", "top");
    			attr_dev(a2, "title", "Github");
    			attr_dev(a2, "class", "svelte-92yret");
    			add_location(a2, file$g, 17, 6, 438);
    			attr_dev(li2, "class", "svelte-92yret");
    			add_location(li2, file$g, 16, 4, 427);
    			attr_dev(i3, "class", "fab fa-linkedin");
    			add_location(i3, file$g, 29, 8, 751);
    			attr_dev(a3, "href", "https://www.linkedin.com/in/omar-sherif-2152021a3/");
    			attr_dev(a3, "data-placement", "top");
    			attr_dev(a3, "title", "Linkedin");
    			attr_dev(a3, "class", "svelte-92yret");
    			add_location(a3, file$g, 24, 6, 612);
    			attr_dev(li3, "class", "svelte-92yret");
    			add_location(li3, file$g, 23, 4, 601);
    			attr_dev(i4, "class", "fas fa-at");
    			add_location(i4, file$g, 36, 25, 1023);
    			attr_dev(a4, "href", "mailto:osa.helpme@gmail.com?subject=Ask%20&body=Dear%20Omar%20Sherif%2C%0AI%20want%20to%20know%20more%20about%20the%20WareHouse%20API");
    			attr_dev(a4, "data-placement", "top");
    			attr_dev(a4, "title", "Email Me");
    			attr_dev(a4, "class", "svelte-92yret");
    			add_location(a4, file$g, 33, 6, 817);
    			attr_dev(li4, "class", "svelte-92yret");
    			add_location(li4, file$g, 32, 4, 806);
    			attr_dev(ul0, "class", "footer-social svelte-92yret");
    			add_location(ul0, file$g, 1, 2, 11);
    			attr_dev(a5, "href", "https://documenter.getpostman.com/view/17286684/UUy65PqF");
    			attr_dev(a5, "data-placement", "top");
    			attr_dev(a5, "title", "Documentation");
    			add_location(a5, file$g, 42, 6, 1145);
    			attr_dev(li5, "class", "list-inline-item svelte-92yret");
    			add_location(li5, file$g, 41, 4, 1109);
    			attr_dev(a6, "href", "#");
    			attr_dev(a6, "data-placement", "top");
    			attr_dev(a6, "title", "About");
    			add_location(a6, file$g, 49, 6, 1354);
    			attr_dev(li6, "class", "list-inline-item svelte-92yret");
    			add_location(li6, file$g, 48, 4, 1318);
    			attr_dev(a7, "href", "#");
    			attr_dev(a7, "data-placement", "top");
    			attr_dev(a7, "title", "Home");
    			add_location(a7, file$g, 52, 6, 1461);
    			attr_dev(li7, "class", "list-inline-item svelte-92yret");
    			add_location(li7, file$g, 51, 4, 1425);
    			attr_dev(a8, "href", "#");
    			attr_dev(a8, "data-placement", "top");
    			attr_dev(a8, "title", "Privacy & Policy");
    			add_location(a8, file$g, 55, 6, 1566);
    			attr_dev(li8, "class", "list-inline-item svelte-92yret");
    			add_location(li8, file$g, 54, 4, 1530);
    			attr_dev(ul1, "class", "footer-parent svelte-92yret");
    			add_location(ul1, file$g, 40, 2, 1078);
    			attr_dev(i5, "class", "fas fa-heart");
    			set_style(i5, "color", "red");
    			add_location(i5, file$g, 61, 14, 1724);
    			attr_dev(p0, "class", "footer-copyright svelte-92yret");
    			add_location(p0, file$g, 60, 2, 1681);
    			add_location(script, file$g, 66, 4, 1861);
    			attr_dev(p1, "class", "footer-copyright svelte-92yret");
    			add_location(p1, file$g, 64, 2, 1808);
    			attr_dev(footer, "class", "svelte-92yret");
    			add_location(footer, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a0);
    			append_dev(a0, i0);
    			append_dev(ul0, t0);
    			append_dev(ul0, li1);
    			append_dev(li1, a1);
    			append_dev(a1, i1);
    			append_dev(ul0, t1);
    			append_dev(ul0, li2);
    			append_dev(li2, a2);
    			append_dev(a2, i2);
    			append_dev(ul0, t2);
    			append_dev(ul0, li3);
    			append_dev(li3, a3);
    			append_dev(a3, i3);
    			append_dev(ul0, t3);
    			append_dev(ul0, li4);
    			append_dev(li4, a4);
    			append_dev(a4, i4);
    			append_dev(footer, t4);
    			append_dev(footer, ul1);
    			append_dev(ul1, li5);
    			append_dev(li5, a5);
    			append_dev(ul1, t6);
    			append_dev(ul1, li6);
    			append_dev(li6, a6);
    			append_dev(ul1, t8);
    			append_dev(ul1, li7);
    			append_dev(li7, a7);
    			append_dev(ul1, t10);
    			append_dev(ul1, li8);
    			append_dev(li8, a8);
    			append_dev(footer, t12);
    			append_dev(footer, p0);
    			append_dev(p0, t13);
    			append_dev(p0, i5);
    			append_dev(p0, t14);
    			append_dev(footer, t15);
    			append_dev(footer, p1);
    			append_dev(p1, t16);
    			append_dev(p1, script);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* node_modules/svelte-date-range-select/src/DateRangeSelect.svelte generated by Svelte v3.49.0 */
    const file$f = "node_modules/svelte-date-range-select/src/DateRangeSelect.svelte";

    // (178:2) {:else}
    function create_else_block$4(ctx) {
    	let t0_value = /*labels*/ ctx[0].range + "";
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(/*daysInDateRange*/ ctx[10]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labels*/ 1 && t0_value !== (t0_value = /*labels*/ ctx[0].range + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*daysInDateRange*/ 1024) set_data_dev(t2, /*daysInDateRange*/ ctx[10]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(178:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (176:24) 
    function create_if_block_2$3(ctx) {
    	let t_value = /*labels*/ ctx[0].greaterThan + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labels*/ 1 && t_value !== (t_value = /*labels*/ ctx[0].greaterThan + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(176:24) ",
    		ctx
    	});

    	return block;
    }

    // (174:21) 
    function create_if_block_1$5(ctx) {
    	let t_value = /*labels*/ ctx[0].lessThan + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labels*/ 1 && t_value !== (t_value = /*labels*/ ctx[0].lessThan + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(174:21) ",
    		ctx
    	});

    	return block;
    }

    // (172:2) {#if !startDate && !endDate}
    function create_if_block$9(ctx) {
    	let t_value = /*labels*/ ctx[0].notSet + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labels*/ 1 && t_value !== (t_value = /*labels*/ ctx[0].notSet + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(172:2) {#if !startDate && !endDate}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let span;
    	let t0;
    	let t1;
    	let t2;
    	let br0;
    	let t3;
    	let input0;
    	let t4;
    	let input1;
    	let t5;
    	let button;
    	let t6_value = /*labels*/ ctx[0].apply + "";
    	let t6;
    	let button_title_value;
    	let t7;
    	let br1;
    	let t8;
    	let input2;
    	let input2_title_value;
    	let t9;
    	let input3;
    	let input3_title_value;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (!/*startDate*/ ctx[4] && !/*endDate*/ ctx[5]) return create_if_block$9;
    		if (/*lessThan*/ ctx[8]) return create_if_block_1$5;
    		if (/*greaterThan*/ ctx[9]) return create_if_block_2$3;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*heading*/ ctx[1]);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			button = element("button");
    			t6 = text(t6_value);
    			t7 = space();
    			br1 = element("br");
    			t8 = space();
    			input2 = element("input");
    			t9 = space();
    			input3 = element("input");
    			attr_dev(span, "class", "heading svelte-nnopc8");
    			add_location(span, file$f, 168, 0, 4510);
    			add_location(br0, file$f, 182, 0, 4757);
    			attr_dev(input0, "type", "date");
    			attr_dev(input0, "id", /*startDateId*/ ctx[3]);
    			attr_dev(input0, "class", "dateSelect svelte-nnopc8");
    			attr_dev(input0, "min", /*startDateMinRfc*/ ctx[13]);
    			attr_dev(input0, "max", /*endDateMaxRfc*/ ctx[14]);
    			add_location(input0, file$f, 184, 0, 4765);
    			attr_dev(input1, "type", "date");
    			attr_dev(input1, "id", /*endDateId*/ ctx[2]);
    			attr_dev(input1, "class", "dateSelect svelte-nnopc8");
    			attr_dev(input1, "min", /*startDateMinRfc*/ ctx[13]);
    			attr_dev(input1, "max", /*endDateMaxRfc*/ ctx[14]);
    			add_location(input1, file$f, 195, 0, 4964);
    			attr_dev(button, "class", "applyButton svelte-nnopc8");
    			attr_dev(button, "title", button_title_value = /*labels*/ ctx[0].apply);
    			add_location(button, file$f, 206, 0, 5156);
    			add_location(br1, file$f, 210, 0, 5251);
    			attr_dev(input2, "type", "range");
    			attr_dev(input2, "class", "sliderStart svelte-nnopc8");
    			attr_dev(input2, "min", /*startDateMinTimestamp*/ ctx[11]);
    			attr_dev(input2, "max", /*endDateMaxTimestamp*/ ctx[12]);
    			attr_dev(input2, "step", "86400000");
    			attr_dev(input2, "title", input2_title_value = new Date(/*startDate*/ ctx[4]));
    			add_location(input2, file$f, 212, 0, 5259);
    			attr_dev(input3, "type", "range");
    			attr_dev(input3, "class", "sliderEnd svelte-nnopc8");
    			attr_dev(input3, "min", /*startDateMinTimestamp*/ ctx[11]);
    			attr_dev(input3, "max", /*endDateMaxTimestamp*/ ctx[12]);
    			attr_dev(input3, "step", "86400000");
    			attr_dev(input3, "title", input3_title_value = new Date(/*endDate*/ ctx[5]));
    			add_location(input3, file$f, 224, 0, 5522);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			if_block.m(span, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*startDate*/ ctx[4]);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*endDate*/ ctx[5]);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button, anchor);
    			append_dev(button, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*sliderStartTimestamp*/ ctx[6]);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, input3, anchor);
    			set_input_value(input3, /*sliderEndTimestamp*/ ctx[7]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[20]),
    					listen_dev(input0, "input", /*input_handler*/ ctx[21], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[22]),
    					listen_dev(input1, "input", /*input_handler_1*/ ctx[23], false, false, false),
    					listen_dev(button, "click", /*apply*/ ctx[16], false, false, false),
    					listen_dev(input2, "change", /*input2_change_input_handler*/ ctx[24]),
    					listen_dev(input2, "input", /*input2_change_input_handler*/ ctx[24]),
    					listen_dev(input2, "input", /*input_handler_2*/ ctx[25], false, false, false),
    					listen_dev(input3, "change", /*input3_change_input_handler*/ ctx[26]),
    					listen_dev(input3, "input", /*input3_change_input_handler*/ ctx[26]),
    					listen_dev(input3, "input", /*input_handler_3*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*heading*/ 2) set_data_dev(t0, /*heading*/ ctx[1]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}

    			if (dirty[0] & /*startDateId*/ 8) {
    				attr_dev(input0, "id", /*startDateId*/ ctx[3]);
    			}

    			if (dirty[0] & /*startDate*/ 16) {
    				set_input_value(input0, /*startDate*/ ctx[4]);
    			}

    			if (dirty[0] & /*endDateId*/ 4) {
    				attr_dev(input1, "id", /*endDateId*/ ctx[2]);
    			}

    			if (dirty[0] & /*endDate*/ 32) {
    				set_input_value(input1, /*endDate*/ ctx[5]);
    			}

    			if (dirty[0] & /*labels*/ 1 && t6_value !== (t6_value = /*labels*/ ctx[0].apply + "")) set_data_dev(t6, t6_value);

    			if (dirty[0] & /*labels*/ 1 && button_title_value !== (button_title_value = /*labels*/ ctx[0].apply)) {
    				attr_dev(button, "title", button_title_value);
    			}

    			if (dirty[0] & /*startDate*/ 16 && input2_title_value !== (input2_title_value = new Date(/*startDate*/ ctx[4]))) {
    				attr_dev(input2, "title", input2_title_value);
    			}

    			if (dirty[0] & /*sliderStartTimestamp*/ 64) {
    				set_input_value(input2, /*sliderStartTimestamp*/ ctx[6]);
    			}

    			if (dirty[0] & /*endDate*/ 32 && input3_title_value !== (input3_title_value = new Date(/*endDate*/ ctx[5]))) {
    				attr_dev(input3, "title", input3_title_value);
    			}

    			if (dirty[0] & /*sliderEndTimestamp*/ 128) {
    				set_input_value(input3, /*sliderEndTimestamp*/ ctx[7]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if_block.d();
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(input3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function timeStampToRfc(date) {
    	if (date) return new Date(date).toJSON().slice(0, 10);
    	return undefined;
    }

    function dateToTimeStamp(date) {
    	if (date) return new Date(date).valueOf();
    	return undefined;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DateRangeSelect', slots, []);
    	let { startDateMin } = $$props;
    	let { endDateMax } = $$props;
    	let { name } = $$props;
    	let { heading } = $$props;
    	let { labels } = $$props;
    	let { endDateId } = $$props;
    	let { startDateId } = $$props;

    	let defaultLabels = {
    		notSet: 'not set',
    		greaterThan: 'greater than',
    		lessThan: 'less than',
    		range: 'range',
    		day: 'day',
    		days: 'days!!',
    		apply: 'Apply'
    	};

    	labels = { ...defaultLabels, ...labels };
    	if (!endDateMax) endDateMax = new Date();

    	if (!startDateMin) {
    		startDateMin = new Date(new Date().setFullYear(endDateMax.getFullYear(), endDateMax.getMonth() - 12));
    	}

    	const dispatch = createEventDispatcher();
    	let today = new Date();
    	const todayRfc = timeStampToRfc(today);
    	const todayTimestamp = dateToTimeStamp(today);
    	const startDateMinTimestamp = dateToTimeStamp(startDateMin);
    	const endDateMaxTimestamp = dateToTimeStamp(endDateMax);
    	const startDateMinRfc = timeStampToRfc(startDateMin);
    	const endDateMaxRfc = timeStampToRfc(endDateMax);
    	let sliderStartTimestamp = todayTimestamp;
    	let sliderEndTimestamp = todayTimestamp;
    	let startDate = todayRfc;
    	let endDate = todayRfc;
    	let lessThan = false;
    	let greaterThan = false;
    	let daysInDateRange;

    	function dateOrSliderChange(item) {
    		if (item == "endDate" && endDate && endDate < startDate) $$invalidate(4, startDate = endDate);
    		if (item == "startDate" && startDate && startDate > endDate && endDate) $$invalidate(5, endDate = startDate);

    		if (item == "endDate" || item == "startDate") {
    			$$invalidate(7, sliderEndTimestamp = dateToTimeStamp(endDate));
    			$$invalidate(6, sliderStartTimestamp = dateToTimeStamp(startDate));
    		}

    		if (item == "sliderEndTimestamp" && sliderEndTimestamp < sliderStartTimestamp || !sliderStartTimestamp) $$invalidate(6, sliderStartTimestamp = sliderEndTimestamp);
    		if (item == "sliderStartTimestamp" && sliderStartTimestamp > sliderEndTimestamp || !sliderEndTimestamp) $$invalidate(7, sliderEndTimestamp = sliderStartTimestamp);

    		if (item == "sliderEndTimestamp" || item == "sliderStartTimestamp") {
    			$$invalidate(5, endDate = timeStampToRfc(sliderEndTimestamp));
    			$$invalidate(4, startDate = timeStampToRfc(sliderStartTimestamp));
    		}

    		if (!endDate && startDate) {
    			$$invalidate(9, greaterThan = true);
    			$$invalidate(8, lessThan = false);
    		}

    		if (!startDate && endDate) {
    			$$invalidate(9, greaterThan = false);
    			$$invalidate(8, lessThan = true);
    		}

    		if (startDate && endDate) {
    			$$invalidate(8, lessThan = false);
    			$$invalidate(9, greaterThan = false);
    		}
    	}

    	function numberOfDaysBetweenSelectedDateRange(startDate, endDate) {
    		if (endDate == startDate) {
    			return `1 ${labels.day}`;
    		} else {
    			const differenceInTime = new Date(endDate).getTime() - new Date(startDate).getTime();
    			return (differenceInTime / (1000 * 3600 * 24)).toString() + ` ${labels.days}`;
    		}
    	}

    	const apply = () => {
    		dispatch("onApplyDateRange", { startDate, endDate, name });
    	};

    	const writable_props = [
    		'startDateMin',
    		'endDateMax',
    		'name',
    		'heading',
    		'labels',
    		'endDateId',
    		'startDateId'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DateRangeSelect> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		startDate = this.value;
    		$$invalidate(4, startDate);
    	}

    	const input_handler = () => {
    		dateOrSliderChange('startDate');
    	};

    	function input1_input_handler() {
    		endDate = this.value;
    		$$invalidate(5, endDate);
    	}

    	const input_handler_1 = () => {
    		dateOrSliderChange('endDate');
    	};

    	function input2_change_input_handler() {
    		sliderStartTimestamp = to_number(this.value);
    		$$invalidate(6, sliderStartTimestamp);
    	}

    	const input_handler_2 = () => {
    		dateOrSliderChange('sliderStartTimestamp');
    	};

    	function input3_change_input_handler() {
    		sliderEndTimestamp = to_number(this.value);
    		$$invalidate(7, sliderEndTimestamp);
    	}

    	const input_handler_3 = () => {
    		dateOrSliderChange('sliderEndTimestamp');
    	};

    	$$self.$$set = $$props => {
    		if ('startDateMin' in $$props) $$invalidate(17, startDateMin = $$props.startDateMin);
    		if ('endDateMax' in $$props) $$invalidate(18, endDateMax = $$props.endDateMax);
    		if ('name' in $$props) $$invalidate(19, name = $$props.name);
    		if ('heading' in $$props) $$invalidate(1, heading = $$props.heading);
    		if ('labels' in $$props) $$invalidate(0, labels = $$props.labels);
    		if ('endDateId' in $$props) $$invalidate(2, endDateId = $$props.endDateId);
    		if ('startDateId' in $$props) $$invalidate(3, startDateId = $$props.startDateId);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		startDateMin,
    		endDateMax,
    		name,
    		heading,
    		labels,
    		endDateId,
    		startDateId,
    		defaultLabels,
    		dispatch,
    		today,
    		todayRfc,
    		todayTimestamp,
    		startDateMinTimestamp,
    		endDateMaxTimestamp,
    		startDateMinRfc,
    		endDateMaxRfc,
    		sliderStartTimestamp,
    		sliderEndTimestamp,
    		startDate,
    		endDate,
    		lessThan,
    		greaterThan,
    		daysInDateRange,
    		dateOrSliderChange,
    		timeStampToRfc,
    		dateToTimeStamp,
    		numberOfDaysBetweenSelectedDateRange,
    		apply
    	});

    	$$self.$inject_state = $$props => {
    		if ('startDateMin' in $$props) $$invalidate(17, startDateMin = $$props.startDateMin);
    		if ('endDateMax' in $$props) $$invalidate(18, endDateMax = $$props.endDateMax);
    		if ('name' in $$props) $$invalidate(19, name = $$props.name);
    		if ('heading' in $$props) $$invalidate(1, heading = $$props.heading);
    		if ('labels' in $$props) $$invalidate(0, labels = $$props.labels);
    		if ('endDateId' in $$props) $$invalidate(2, endDateId = $$props.endDateId);
    		if ('startDateId' in $$props) $$invalidate(3, startDateId = $$props.startDateId);
    		if ('defaultLabels' in $$props) defaultLabels = $$props.defaultLabels;
    		if ('today' in $$props) today = $$props.today;
    		if ('sliderStartTimestamp' in $$props) $$invalidate(6, sliderStartTimestamp = $$props.sliderStartTimestamp);
    		if ('sliderEndTimestamp' in $$props) $$invalidate(7, sliderEndTimestamp = $$props.sliderEndTimestamp);
    		if ('startDate' in $$props) $$invalidate(4, startDate = $$props.startDate);
    		if ('endDate' in $$props) $$invalidate(5, endDate = $$props.endDate);
    		if ('lessThan' in $$props) $$invalidate(8, lessThan = $$props.lessThan);
    		if ('greaterThan' in $$props) $$invalidate(9, greaterThan = $$props.greaterThan);
    		if ('daysInDateRange' in $$props) $$invalidate(10, daysInDateRange = $$props.daysInDateRange);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*startDate, endDate*/ 48) {
    			$$invalidate(10, daysInDateRange = numberOfDaysBetweenSelectedDateRange(startDate, endDate));
    		}
    	};

    	return [
    		labels,
    		heading,
    		endDateId,
    		startDateId,
    		startDate,
    		endDate,
    		sliderStartTimestamp,
    		sliderEndTimestamp,
    		lessThan,
    		greaterThan,
    		daysInDateRange,
    		startDateMinTimestamp,
    		endDateMaxTimestamp,
    		startDateMinRfc,
    		endDateMaxRfc,
    		dateOrSliderChange,
    		apply,
    		startDateMin,
    		endDateMax,
    		name,
    		input0_input_handler,
    		input_handler,
    		input1_input_handler,
    		input_handler_1,
    		input2_change_input_handler,
    		input_handler_2,
    		input3_change_input_handler,
    		input_handler_3
    	];
    }

    class DateRangeSelect extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
    			safe_not_equal,
    			{
    				startDateMin: 17,
    				endDateMax: 18,
    				name: 19,
    				heading: 1,
    				labels: 0,
    				endDateId: 2,
    				startDateId: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DateRangeSelect",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*startDateMin*/ ctx[17] === undefined && !('startDateMin' in props)) {
    			console.warn("<DateRangeSelect> was created without expected prop 'startDateMin'");
    		}

    		if (/*endDateMax*/ ctx[18] === undefined && !('endDateMax' in props)) {
    			console.warn("<DateRangeSelect> was created without expected prop 'endDateMax'");
    		}

    		if (/*name*/ ctx[19] === undefined && !('name' in props)) {
    			console.warn("<DateRangeSelect> was created without expected prop 'name'");
    		}

    		if (/*heading*/ ctx[1] === undefined && !('heading' in props)) {
    			console.warn("<DateRangeSelect> was created without expected prop 'heading'");
    		}

    		if (/*labels*/ ctx[0] === undefined && !('labels' in props)) {
    			console.warn("<DateRangeSelect> was created without expected prop 'labels'");
    		}

    		if (/*endDateId*/ ctx[2] === undefined && !('endDateId' in props)) {
    			console.warn("<DateRangeSelect> was created without expected prop 'endDateId'");
    		}

    		if (/*startDateId*/ ctx[3] === undefined && !('startDateId' in props)) {
    			console.warn("<DateRangeSelect> was created without expected prop 'startDateId'");
    		}
    	}

    	get startDateMin() {
    		throw new Error("<DateRangeSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startDateMin(value) {
    		throw new Error("<DateRangeSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get endDateMax() {
    		throw new Error("<DateRangeSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set endDateMax(value) {
    		throw new Error("<DateRangeSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<DateRangeSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<DateRangeSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<DateRangeSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<DateRangeSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<DateRangeSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<DateRangeSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get endDateId() {
    		throw new Error("<DateRangeSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set endDateId(value) {
    		throw new Error("<DateRangeSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startDateId() {
    		throw new Error("<DateRangeSelect>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startDateId(value) {
    		throw new Error("<DateRangeSelect>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/todoList/DateFilter.svelte generated by Svelte v3.49.0 */

    // (63:0) {#if range.startDate !== null}
    function create_if_block$8(ctx) {
    	let t0_value = /*range*/ ctx[0].startDate + "";
    	let t0;
    	let t1;
    	let t2_value = /*range*/ ctx[0].endDate + "";
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*range*/ 1 && t0_value !== (t0_value = /*range*/ ctx[0].startDate + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*range*/ 1 && t2_value !== (t2_value = /*range*/ ctx[0].endDate + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(63:0) {#if range.startDate !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let daterangeselect;
    	let t;
    	let if_block_anchor;
    	let current;

    	daterangeselect = new DateRangeSelect({
    			props: {
    				startDateMin: /*startDateMin*/ ctx[2],
    				endDateMax: /*endDateMax*/ ctx[1],
    				name,
    				heading,
    				labels: /*labels*/ ctx[3],
    				startDateId,
    				endDateId
    			},
    			$$inline: true
    		});

    	daterangeselect.$on("onApplyDateRange", /*handleApplyDateRange*/ ctx[4]);
    	let if_block = /*range*/ ctx[0].startDate !== null && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			create_component(daterangeselect.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(daterangeselect, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*range*/ ctx[0].startDate !== null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(daterangeselect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(daterangeselect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(daterangeselect, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const name = "createdDate";
    const heading = "Created Date";

    // form post ids
    const startDateId = "start_date_id";

    const endDateId = "end_date_id";

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DateFilter', slots, []);
    	const dispatch = createEventDispatcher();
    	let range = { startDate: null, endDate: null };

    	// this limits the HTML5 date picker end date - e.g. today is used here
    	const endDateMax = new Date();

    	// this limits the HTML5 date picker's start date - e.g. 3 years is select here
    	const startDateMin = new Date(new Date().setFullYear(endDateMax.getFullYear(), endDateMax.getMonth() - 36));

    	// option to override the defaults - change to other language, below are the default values
    	const labels = {
    		notSet: "not set",
    		greaterThan: "greater than",
    		lessThan: "less than",
    		range: "range",
    		day: "day",
    		days: "days",
    		apply: "Apply"
    	};

    	// executed when the user selects the range by clicking the apply button (with the fa-check icon)
    	function handleApplyDateRange(data) {
    		// e.g. will return an object
    		// {
    		$$invalidate(0, range = data.detail);

    		dispatch("applyDateRange", {
    			startDate: data.detail.startDate,
    			endDate: data.detail.endDate
    		});
    	} //  startDate: 2000-12-01,
    	//  endDate: 2020-04-06,

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DateFilter> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		DateRangeSelect,
    		range,
    		name,
    		heading,
    		endDateMax,
    		startDateMin,
    		labels,
    		startDateId,
    		endDateId,
    		handleApplyDateRange
    	});

    	$$self.$inject_state = $$props => {
    		if ('range' in $$props) $$invalidate(0, range = $$props.range);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [range, endDateMax, startDateMin, labels, handleApplyDateRange];
    }

    class DateFilter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DateFilter",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/components/todoList/Filters.svelte generated by Svelte v3.49.0 */
    const file$e = "src/components/todoList/Filters.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let datefilter;
    	let current;
    	datefilter = new DateFilter({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(datefilter.$$.fragment);
    			attr_dev(div, "class", "filters svelte-ojn6se");
    			add_location(div, file$e, 3, 0, 75);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(datefilter, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datefilter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datefilter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(datefilter);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filters', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filters> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ DateFilter });
    	return [];
    }

    class Filters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filters",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const SettingsStore = writable({ "name": null, "email": null, "primary-color": "#aaaa", "secondary-color": "#eee", "background-image": "url('https://wallpaperaccess.com/full/2159209.jpg')" });
    const TodoListStore = writable([]);

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    // eslint-disable-next-line func-names
    var kindOf = (function(cache) {
      // eslint-disable-next-line func-names
      return function(thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    })(Object.create(null));

    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf(thing) === type;
      };
    }

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return Array.isArray(val);
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    var isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (kindOf(val) !== 'object') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    var isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    var isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} thing The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(thing) {
      var pattern = '[object FormData]';
      return thing && (
        (typeof FormData === 'function' && thing instanceof FormData) ||
        toString.call(thing) === pattern ||
        (isFunction(thing.toString) && thing.toString() === pattern)
      );
    }

    /**
     * Determine if a value is a URLSearchParams object
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    var isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    /**
     * Inherit the prototype methods from one constructor into another
     * @param {function} constructor
     * @param {function} superConstructor
     * @param {object} [props]
     * @param {object} [descriptors]
     */

    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }

    /**
     * Resolve object with deep prototype chain to a flat object
     * @param {Object} sourceObj source object
     * @param {Object} [destObj]
     * @param {Function} [filter]
     * @returns {Object}
     */

    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};

      destObj = destObj || {};

      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

      return destObj;
    }

    /*
     * determines whether a string ends with the characters of a specified string
     * @param {String} str
     * @param {String} searchString
     * @param {Number} [position= 0]
     * @returns {boolean}
     */
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }


    /**
     * Returns new array from array like object
     * @param {*} [thing]
     * @returns {Array}
     */
    function toArray(thing) {
      if (!thing) return null;
      var i = thing.length;
      if (isUndefined(i)) return null;
      var arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    }

    // eslint-disable-next-line func-names
    var isTypedArray = (function(TypedArray) {
      // eslint-disable-next-line func-names
      return function(thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM,
      inherits: inherits,
      toFlatObject: toFlatObject,
      kindOf: kindOf,
      kindOfTest: kindOfTest,
      endsWith: endsWith,
      toArray: toArray,
      isTypedArray: isTypedArray,
      isFileList: isFileList
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    function AxiosError(message, code, config, request, response) {
      Error.call(this);
      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });

    var prototype = AxiosError.prototype;
    var descriptors = {};

    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED'
    // eslint-disable-next-line func-names
    ].forEach(function(code) {
      descriptors[code] = {value: code};
    });

    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, 'isAxiosError', {value: true});

    // eslint-disable-next-line func-names
    AxiosError.from = function(error, code, config, request, response, customProps) {
      var axiosError = Object.create(prototype);

      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });

      AxiosError.call(axiosError, error.message, code, config, request, response);

      axiosError.name = error.name;

      customProps && Object.assign(axiosError, customProps);

      return axiosError;
    };

    var AxiosError_1 = AxiosError;

    var transitional = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    /**
     * Convert a data object to FormData
     * @param {Object} obj
     * @param {?Object} [formData]
     * @returns {Object}
     **/

    function toFormData(obj, formData) {
      // eslint-disable-next-line no-param-reassign
      formData = formData || new FormData();

      var stack = [];

      function convertValue(value) {
        if (value === null) return '';

        if (utils.isDate(value)) {
          return value.toISOString();
        }

        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
        }

        return value;
      }

      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error('Circular reference detected in ' + parentKey);
          }

          stack.push(data);

          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value)) return;
            var fullKey = parentKey ? parentKey + '.' + key : key;
            var arr;

            if (value && !parentKey && typeof value === 'object') {
              if (utils.endsWith(key, '{}')) {
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
              } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
                // eslint-disable-next-line func-names
                arr.forEach(function(el) {
                  !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }

            build(value, fullKey);
          });

          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }

      build(obj);

      return formData;
    }

    var toFormData_1 = toFormData;

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError_1(
          'Request failed with status code ' + response.status,
          [AxiosError_1.ERR_BAD_REQUEST, AxiosError_1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function CanceledError(message) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      AxiosError_1.call(this, message == null ? 'canceled' : message, AxiosError_1.ERR_CANCELED);
      this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError_1, {
      __CANCEL__: true
    });

    var CanceledError_1 = CanceledError;

    var parseProtocol = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || '';
    };

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);

        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(new AxiosError_1('Request aborted', AxiosError_1.ECONNABORTED, config, request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(new AxiosError_1('Network Error', AxiosError_1.ERR_NETWORK, config, request, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          var transitional$1 = config.transitional || transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError_1(
            timeoutErrorMessage,
            transitional$1.clarifyTimeoutError ? AxiosError_1.ETIMEDOUT : AxiosError_1.ECONNABORTED,
            config,
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || (cancel && cancel.type) ? new CanceledError_1() : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        if (!requestData) {
          requestData = null;
        }

        var protocol = parseProtocol(fullPath);

        if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
          reject(new AxiosError_1('Unsupported protocol ' + protocol + ':', AxiosError_1.ERR_BAD_REQUEST, config));
          return;
        }


        // Send the request
        request.send(requestData);
      });
    };

    // eslint-disable-next-line strict
    var _null = null;

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults = {

      transitional: transitional,

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }

        var isObjectPayload = utils.isObject(data);
        var contentType = headers && headers['Content-Type'];

        var isFileList;

        if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
          var _FormData = this.env && this.env.FormData;
          return toFormData_1(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === 'application/json') {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }

        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw AxiosError_1.from(e, AxiosError_1.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      env: {
        FormData: _null
      },

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      var context = this || defaults_1;
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new CanceledError_1();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      var mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'beforeRedirect': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
      };

      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    };

    var data = {
      "version": "0.27.2"
    };

    var VERSION = data.version;


    var validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};

    /**
     * Transitional option validator
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new AxiosError_1(
            formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
            AxiosError_1.ERR_DEPRECATED
          );
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError_1('options must be an object', AxiosError_1.ERR_BAD_OPTION_VALUE);
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError_1('option ' + opt + ' must be ' + result, AxiosError_1.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError_1('Unknown option ' + opt, AxiosError_1.ERR_BAD_OPTION);
        }
      }
    }

    var validator = {
      assertOptions: assertOptions,
      validators: validators$1
    };

    var validators = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/

      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method: method,
            headers: isForm ? {
              'Content-Type': 'multipart/form-data'
            } : {},
            url: url,
            data: data
          }));
        };
      }

      Axios.prototype[method] = generateHTTPMethod();

      Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    var Axios_1 = Axios;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;

      // eslint-disable-next-line func-names
      this.promise.then(function(cancel) {
        if (!token._listeners) return;

        var i;
        var l = token._listeners.length;

        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = function(onfulfilled) {
        var _resolve;
        // eslint-disable-next-line func-names
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new CanceledError_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Subscribe to the cancel signal
     */

    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };

    /**
     * Unsubscribe from the cancel signal
     */

    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return utils.isObject(payload) && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Expose Cancel & CancelToken
    axios$1.CanceledError = CanceledError_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;
    axios$1.VERSION = data.version;
    axios$1.toFormData = toFormData_1;

    // Expose AxiosError class
    axios$1.AxiosError = AxiosError_1;

    // alias for CanceledError for backward compatibility
    axios$1.Cancel = axios$1.CanceledError;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var _default = axios$1;
    axios_1.default = _default;

    var axios = axios_1;

    var http = axios.create({
        baseURL: ('http://localhost:8080/api/v1/' + ""),
        headers: {
            "Content-type": "application/json",
        },
    });
    //we use axios.create to create a new instance of Axios with a custom 
    //config that has a base URL of  and a timeout of 1s.

    class SettingsApi {
        getSettings() {
            const settings = {
                name: localStorage.getItem("name"),
                email: localStorage.getItem("email"),
                "primary-color": localStorage.getItem("primary-color") || "#aaaa",
                "secondary-color": localStorage.getItem("secondary-color") || "#eee",
                "background-image": localStorage.getItem("background-image") || "url('https://wallpaperaccess.com/full/2159209.jpg')"
            };
            return settings;
        }
        setSettings(settings) {
            localStorage.setItem("name", settings.name);
            localStorage.setItem("email", settings.email);
            localStorage.setItem("primary-color", settings["primary-color"]);
            localStorage.setItem("secondary-color", settings["secondary-color"]);
            localStorage.setItem("background-image", settings["background-image"]);
            this.updateSettings();
        }
        updateSettings() {
            const settings = {
                name: localStorage.getItem("name"),
                email: localStorage.getItem("email"),
                "primary-color": localStorage.getItem("primary-color") || "#aaaa",
                "secondary-color": localStorage.getItem("secondary-color") || "#eee",
                "background-image": localStorage.getItem("background-image") || "url('https://wallpaperaccess.com/full/2159209.jpg')"
            };
            SettingsStore.set(settings);
        }
        isName() {
            console.log("@localStorage", localStorage.getItem("name"));
            console.log("@localStorage name", localStorage.getItem("name") !== null);
            return localStorage.getItem("name") !== null;
        }
        getName() {
            return localStorage.getItem("name");
        }
    }
    var SettingsApi$1 = new SettingsApi();

    class TodosDataService {
        async getAll() {
            return http.get(`/todo`);
        }
        async getById(id) {
            return http.get(`/todo?id=${id}`);
        }
        async getByAuthor(author) {
            if (author === null) {
                SettingsApi$1.updateSettings();
                author = SettingsStore['name'];
                console.log("author was null", author);
            }
            return await http.get(`/todo?author=${author.toLowerCase().replace("#", '')}`);
        }
        async create(data) {
            if (data.author === null) {
                SettingsApi$1.updateSettings();
                data.author = SettingsStore['name'];
            }
            data.author = data.author.toLowerCase().replace("#", '');
            return http.post(`/todo`, data);
        }
        async update(id, data) {
            if (data.author === null) {
                SettingsApi$1.updateSettings();
                data.author = SettingsStore['name'];
            }
            console.log("in api status : ", data.status);
            data.author = data.author.toLowerCase().replace("#", '');
            return http.put(`/todo?id=${id}`, data);
        }
        async delete(id) {
            return http.delete(`/todo?id=${id}`);
        }
    }
    var TodosDataService$1 = new TodosDataService();

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function blur(node, { delay = 0, duration = 400, easing = cubicInOut, amount = 5, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const f = style.filter === 'none' ? '' : style.filter;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `opacity: ${target_opacity - (od * u)}; filter: ${f} blur(${u * amount}px);`
        };
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        let len = node.getTotalLength();
        const style = getComputedStyle(node);
        if (style.strokeLinecap !== 'butt') {
            len += parseInt(style.strokeWidth);
        }
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    var svelteTransitions = /*#__PURE__*/Object.freeze({
        __proto__: null,
        blur: blur,
        crossfade: crossfade,
        draw: draw,
        fade: fade,
        fly: fly,
        scale: scale,
        slide: slide
    });

    "undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,"@charset \"UTF-8\";\n" +
    ".dialog__overlay {\n" +
    "  z-index: 1000;\n" +
    "  background: rgba(128, 128, 128, 0.5);\n" +
    "  position: fixed;\n" +
    "  top: 0;\n" +
    "  left: 0;\n" +
    "  width: 100vw;\n" +
    "  height: 100vh;\n" +
    "  display: flex;\n" +
    "  justify-content: center;\n" +
    "  align-items: center;\n" +
    "}\n" +
    "\n" +
    ".dialog__container {\n" +
    "  z-index: 1010;\n" +
    "  position: fixed;\n" +
    "  box-sizing: border-box;\n" +
    "  max-height: 100vh;\n" +
    "  min-width: 25vw;\n" +
    "  max-width: 50vw;\n" +
    "  padding: 2rem;\n" +
    "  border-radius: 1rem;\n" +
    "  background-color: #fff;\n" +
    "}\n" +
    "@media (max-width: 640px) {\n" +
    "  .dialog__container {\n" +
    "    max-width: 75vw;\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    ".dialog__container--no-padding {\n" +
    "  padding: 0;\n" +
    "}\n" +
    "\n" +
    ".dialog__close-button {\n" +
    "  box-sizing: border-box;\n" +
    "  position: absolute;\n" +
    "  top: 0.5rem;\n" +
    "  right: 0.5rem;\n" +
    "  height: 1.5rem;\n" +
    "  width: 1.5rem;\n" +
    "  padding: 0;\n" +
    "  border: none;\n" +
    "  cursor: pointer;\n" +
    "  background: transparent;\n" +
    "  border-radius: 1rem;\n" +
    "  background: #cccccc;\n" +
    "}\n" +
    ".dialog__close-button:after {\n" +
    "  color: #fff;\n" +
    "  content: \"✕\";\n" +
    "}\n" +
    ".dialog__close-button:hover {\n" +
    "  background: rgba(202, 47, 63, 0.8);\n" +
    "}\n" +
    ".dialog__close-button:focus {\n" +
    "  background: rgba(202, 47, 63, 0.8);\n" +
    "}\n" +
    "\n" +
    ".dialog__header {\n" +
    "  text-align: center;\n" +
    "}\n" +
    "\n" +
    ".dialog__header--error {\n" +
    "  padding: 2rem 2rem 0 2rem;\n" +
    "  border-radius: 1rem 1rem 0 0;\n" +
    "  color: #fff;\n" +
    "  background-color: #ca2f3f;\n" +
    "}\n" +
    "\n" +
    ".dialog__header--success {\n" +
    "  padding: 2rem 2rem 0 2rem;\n" +
    "  border-radius: 1rem 1rem 0 0;\n" +
    "  color: #fff;\n" +
    "  background-color: #6ea050;\n" +
    "}\n" +
    "\n" +
    ".dialog__header--warning {\n" +
    "  padding: 2rem 2rem 0 2rem;\n" +
    "  border-radius: 1rem 1rem 0 0;\n" +
    "  color: #fff;\n" +
    "  background-color: #f0be00;\n" +
    "}\n" +
    "\n" +
    ".dialog__title {\n" +
    "  font-size: large;\n" +
    "  font-weight: bold;\n" +
    "  line-height: 1.5;\n" +
    "  margin: 0;\n" +
    "}\n" +
    "\n" +
    ".dialog__title--xx-large {\n" +
    "  font-size: xx-large;\n" +
    "}\n" +
    "\n" +
    ".dialog-content__divider {\n" +
    "  border: 1px solid #808080;\n" +
    "}\n" +
    "\n" +
    ".dialog__body {\n" +
    "  box-sizing: border-box;\n" +
    "  text-align: center;\n" +
    "  padding-top: 1rem;\n" +
    "  min-height: 10vh;\n" +
    "  max-height: calc(100vh - 13rem);\n" +
    "  overflow-y: auto;\n" +
    "}\n" +
    ".dialog__body::-webkit-scrollbar {\n" +
    "  width: 5px;\n" +
    "}\n" +
    ".dialog__body::-webkit-scrollbar-track {\n" +
    "  box-shadow: inset 0 0 5px rgba(204, 204, 204, 0.8);\n" +
    "  border-radius: 10px;\n" +
    "}\n" +
    ".dialog__body::-webkit-scrollbar-thumb {\n" +
    "  box-shadow: inset 0 0 5px #cccccc;\n" +
    "  border-radius: 10px;\n" +
    "}\n" +
    "\n" +
    ".dialog__body--contextual {\n" +
    "  padding: 0 2rem;\n" +
    "}\n" +
    "\n" +
    ".dialog__footer {\n" +
    "  margin-top: 1rem;\n" +
    "  display: flex;\n" +
    "}\n" +
    "\n" +
    ".dialog__footer--contextual {\n" +
    "  padding: 0 2rem 2rem 2rem;\n" +
    "}\n" +
    "\n" +
    ".dialog__footer--space-evenly {\n" +
    "  justify-content: space-evenly;\n" +
    "}\n" +
    "\n" +
    ".dialog__footer--space-between {\n" +
    "  justify-content: space-between;\n" +
    "}\n" +
    "\n" +
    ".dialog__footer--mobile-responsive {\n" +
    "  flex-direction: row;\n" +
    "}\n" +
    "@media (max-width: 640px) {\n" +
    "  .dialog__footer--mobile-responsive {\n" +
    "    flex-direction: column;\n" +
    "  }\n" +
    "  .dialog__footer--mobile-responsive .dialog__button-container {\n" +
    "    display: flex;\n" +
    "    justify-content: space-between;\n" +
    "  }\n" +
    "  .dialog__footer--mobile-responsive .dialog__button-container .dialog__button {\n" +
    "    flex-grow: 1;\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    ".dialog__form.touched .dialog__input:invalid {\n" +
    "  border: 2px solid rgba(202, 47, 63, 0.5);\n" +
    "  outline: 0;\n" +
    "}\n" +
    ".dialog__form.touched .dialog__input:invalid:focus, .dialog__form.touched .dialog__input:invalid:focus-visible {\n" +
    "  border: 2px solid #ca2f3f;\n" +
    "  outline: 0;\n" +
    "}\n" +
    "\n" +
    ".dialog__form-element fieldset {\n" +
    "  box-sizing: border-box;\n" +
    "  margin: 8px 0 0 0;\n" +
    "  width: 100%;\n" +
    "  padding: 1rem;\n" +
    "  background-color: #fff;\n" +
    "  border: 2px solid #cccccc;\n" +
    "  border-radius: 1rem;\n" +
    "}\n" +
    ".dialog__form-element fieldset legend {\n" +
    "  display: block;\n" +
    "  width: -webkit-fit-content;\n" +
    "  width: -moz-fit-content;\n" +
    "  width: fit-content;\n" +
    "  text-align: left;\n" +
    "  position: relative;\n" +
    "  padding: 0 5px;\n" +
    "  background: #fff;\n" +
    "}\n" +
    "\n" +
    ".dialog__input-label {\n" +
    "  display: block;\n" +
    "  width: -webkit-fit-content;\n" +
    "  width: -moz-fit-content;\n" +
    "  width: fit-content;\n" +
    "  margin-left: 1rem;\n" +
    "  text-align: left;\n" +
    "  position: relative;\n" +
    "  top: 8px;\n" +
    "  padding: 0 5px;\n" +
    "  background: #fff;\n" +
    "}\n" +
    "\n" +
    "select.dialog__input[multiple],\n" +
    "textarea.dialog__input {\n" +
    "  overflow-y: auto;\n" +
    "  direction: rtl;\n" +
    "  text-align: left;\n" +
    "}\n" +
    "select.dialog__input[multiple]::-webkit-scrollbar,\n" +
    "textarea.dialog__input::-webkit-scrollbar {\n" +
    "  width: 5px;\n" +
    "}\n" +
    "select.dialog__input[multiple]::-webkit-scrollbar-track,\n" +
    "textarea.dialog__input::-webkit-scrollbar-track {\n" +
    "  box-shadow: inset 0 0 5px rgba(204, 204, 204, 0.8);\n" +
    "  border-radius: 10px;\n" +
    "}\n" +
    "select.dialog__input[multiple]::-webkit-scrollbar-thumb,\n" +
    "textarea.dialog__input::-webkit-scrollbar-thumb {\n" +
    "  box-shadow: inset 0 0 5px #cccccc;\n" +
    "  border-radius: 10px;\n" +
    "}\n" +
    "select.dialog__input[multiple]::-webkit-scrollbar-track,\n" +
    "textarea.dialog__input::-webkit-scrollbar-track {\n" +
    "  margin: 5px;\n" +
    "}\n" +
    "select.dialog__input[multiple] option,\n" +
    "textarea.dialog__input option {\n" +
    "  direction: ltr;\n" +
    "}\n" +
    "\n" +
    ".dialog__input {\n" +
    "  box-sizing: border-box;\n" +
    "  margin: 0;\n" +
    "}\n" +
    ".dialog__input:not([type=checkbox]):not([type=radio]) {\n" +
    "  width: 100%;\n" +
    "  padding: 1rem;\n" +
    "  background-color: #fff;\n" +
    "  border: 2px solid #cccccc;\n" +
    "  border-radius: 1rem;\n" +
    "}\n" +
    ".dialog__input[type=checkbox], .dialog__input[type=radio] {\n" +
    "  width: auto;\n" +
    "  display: block;\n" +
    "  margin-top: -7px;\n" +
    "  text-align: left;\n" +
    "}\n" +
    ".dialog__input[type=color] {\n" +
    "  min-height: 3.5rem;\n" +
    "}\n" +
    ".dialog__input[type=range] {\n" +
    "  padding: 1rem 0;\n" +
    "}\n" +
    ".dialog__input[type=file]::-webkit-file-upload-button {\n" +
    "  display: none;\n" +
    "}\n" +
    ".dialog__input[type=file]::file-selector-button {\n" +
    "  display: none;\n" +
    "}\n" +
    ".dialog__input:focus:not(:invalid) {\n" +
    "  border: 2px solid #333;\n" +
    "}\n" +
    "\n" +
    ".dialog__button {\n" +
    "  box-sizing: border-box;\n" +
    "  display: inline-block;\n" +
    "  cursor: pointer;\n" +
    "  font-size: 1rem;\n" +
    "  padding: 0.5rem;\n" +
    "  margin: 2px;\n" +
    "  min-width: 6rem;\n" +
    "  text-align: center;\n" +
    "  white-space: nowrap;\n" +
    "  vertical-align: middle;\n" +
    "  -webkit-user-select: none;\n" +
    "     -moz-user-select: none;\n" +
    "          user-select: none;\n" +
    "  border: 0.1rem solid transparent;\n" +
    "  border-radius: 0.5rem;\n" +
    "}\n" +
    ".dialog__button:disabled {\n" +
    "  cursor: default;\n" +
    "  opacity: 0.5;\n" +
    "}\n" +
    ".dialog__button:focus {\n" +
    "  border: 0.1rem solid transparent;\n" +
    "}\n" +
    "\n" +
    ".dialog__button--primary {\n" +
    "  background-color: #cccccc;\n" +
    "}\n" +
    ".dialog__button--primary:hover {\n" +
    "  background-color: rgba(204, 204, 204, 0.8);\n" +
    "}\n" +
    ".dialog__button--primary:not(:disabled):active {\n" +
    "  background-color: #cccccc;\n" +
    "}\n" +
    ".dialog__button--primary:focus {\n" +
    "  box-shadow: 0 0 0 3px rgba(204, 204, 204, 0.5);\n" +
    "}\n" +
    "\n" +
    ".dialog__button--decline {\n" +
    "  background-color: #ca2f3f;\n" +
    "  color: #fff;\n" +
    "}\n" +
    ".dialog__button--decline:hover {\n" +
    "  background-color: rgba(202, 47, 63, 0.8);\n" +
    "}\n" +
    ".dialog__button--decline:not(:disabled):active {\n" +
    "  background-color: #ca2f3f;\n" +
    "}\n" +
    ".dialog__button--decline:focus {\n" +
    "  box-shadow: 0 0 0 3px rgba(202, 47, 63, 0.5);\n" +
    "}\n" +
    "\n" +
    ".dialog__button--error {\n" +
    "  background-color: #ca2f3f;\n" +
    "  color: #fff;\n" +
    "}\n" +
    ".dialog__button--error:hover {\n" +
    "  background-color: rgba(202, 47, 63, 0.8);\n" +
    "}\n" +
    ".dialog__button--error:not(:disabled):active {\n" +
    "  background-color: #ca2f3f;\n" +
    "}\n" +
    ".dialog__button--error:focus {\n" +
    "  box-shadow: 0 0 0 3px rgba(202, 47, 63, 0.5);\n" +
    "}\n" +
    "\n" +
    ".dialog__button--success {\n" +
    "  background-color: #6ea050;\n" +
    "  color: #fff;\n" +
    "}\n" +
    ".dialog__button--success:hover {\n" +
    "  background-color: rgba(110, 160, 80, 0.8);\n" +
    "}\n" +
    ".dialog__button--success:not(:disabled):active {\n" +
    "  background-color: #6ea050;\n" +
    "}\n" +
    ".dialog__button--success:focus {\n" +
    "  box-shadow: 0 0 0 3px rgba(110, 160, 80, 0.5);\n" +
    "}\n" +
    "\n" +
    ".dialog__button--warning {\n" +
    "  background-color: #f0be00;\n" +
    "  color: #fff;\n" +
    "}\n" +
    ".dialog__button--warning:hover {\n" +
    "  background-color: rgba(240, 190, 0, 0.8);\n" +
    "}\n" +
    ".dialog__button--warning:not(:disabled):active {\n" +
    "  background-color: #f0be00;\n" +
    "}\n" +
    ".dialog__button--warning:focus {\n" +
    "  box-shadow: 0 0 0 3px rgba(240, 190, 0, 0.5);\n" +
    "}");

    const closeSym = Symbol("close");
    const optsSym = Symbol("opts");

    /**
     *
     * @param {symbol} key - the key associated with the property stored in context
     * @returns {any} - the property sored in context
     * @throws {Error} - if called after component initialization
     */
    const getFromContext = (key) => {
      try {
        return getContext(key);
      } catch (cause) {
        throw new Error(
          `Context element ${key.description} can be retrieved only on component initialization`,
          { cause }
        );
      }
    };

    /**
     * Retrieves the close function from context
     * @returns {function} - the close function stored in context
     */
    const getClose = () => getFromContext(closeSym);
    /**
     * Put the close function in context
     * @param {function} close - the function to store in context
     * @returns {function} - the close function stored in context
     */
    const setClose = (close) => setContext(closeSym, close);
    /**
     * Retrieves the options object from context
     * @returns {object} - the options object stored in context
     */
    const getOptions = () => getFromContext(optsSym);
    /**
     * Put the options object in context
     * @param {object} close - the object to store in context
     * @returns {object} - the options object stored in context
     */
    const setOptions = (opts) => setContext(optsSym, opts);

    /* node_modules/svelte-dialogs/src/components/DialogContent.svelte generated by Svelte v3.49.0 */
    const file$d = "node_modules/svelte-dialogs/src/components/DialogContent.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});
    const get_body_slot_changes = dirty => ({});
    const get_body_slot_context = ctx => ({});
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    // (61:4) {#if title && ($$slots.body || text)}
    function create_if_block_1$4(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			attr_dev(hr, "class", /*dividerClass*/ ctx[5]);
    			attr_dev(hr, "data-testid", "dialog-content__divider");
    			add_location(hr, file$d, 61, 6, 1637);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(61:4) {#if title && ($$slots.body || text)}",
    		ctx
    	});

    	return block;
    }

    // (57:22)      
    function fallback_block_1(ctx) {
    	let h2;
    	let t;
    	let if_block_anchor;
    	let if_block = /*title*/ ctx[3] && (/*$$slots*/ ctx[8].body || /*text*/ ctx[4]) && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h2, "id", /*titleId*/ ctx[2]);
    			attr_dev(h2, "class", /*titleClass*/ ctx[1]);
    			attr_dev(h2, "data-testid", "dialog-content__title");
    			add_location(h2, file$d, 57, 4, 1486);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			h2.innerHTML = /*title*/ ctx[3];
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[3] && (/*$$slots*/ ctx[8].body || /*text*/ ctx[4])) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(57:22)      ",
    		ctx
    	});

    	return block;
    }

    // (67:0) {#if $$slots.body || text}
    function create_if_block$7(ctx) {
    	let div;
    	let current;
    	const body_slot_template = /*#slots*/ ctx[10].body;
    	const body_slot = create_slot(body_slot_template, ctx, /*$$scope*/ ctx[9], get_body_slot_context);
    	const body_slot_or_fallback = body_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (body_slot_or_fallback) body_slot_or_fallback.c();
    			attr_dev(div, "class", /*bodyClass*/ ctx[6]);
    			attr_dev(div, "data-testid", "dialog-content__body");
    			add_location(div, file$d, 67, 2, 1763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (body_slot_or_fallback) {
    				body_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (body_slot) {
    				if (body_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						body_slot,
    						body_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(body_slot_template, /*$$scope*/ ctx[9], dirty, get_body_slot_changes),
    						get_body_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(body_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(body_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (body_slot_or_fallback) body_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(67:0) {#if $$slots.body || text}",
    		ctx
    	});

    	return block;
    }

    // (69:22) {@html text}
    function fallback_block(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*text*/ ctx[4], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(69:22) {@html text}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let header;
    	let t0;
    	let t1;
    	let footer;
    	let current;
    	const header_slot_template = /*#slots*/ ctx[10].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[9], get_header_slot_context);
    	const header_slot_or_fallback = header_slot || fallback_block_1(ctx);
    	let if_block = (/*$$slots*/ ctx[8].body || /*text*/ ctx[4]) && create_if_block$7(ctx);
    	const footer_slot_template = /*#slots*/ ctx[10].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[9], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			header = element("header");
    			if (header_slot_or_fallback) header_slot_or_fallback.c();
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			footer = element("footer");
    			if (footer_slot) footer_slot.c();
    			attr_dev(header, "class", /*headerClass*/ ctx[0]);
    			attr_dev(header, "data-testid", "dialog-content__header");
    			add_location(header, file$d, 55, 0, 1393);
    			attr_dev(footer, "class", /*footerClass*/ ctx[7]);
    			attr_dev(footer, "data-testid", "dialog-content__footer");
    			add_location(footer, file$d, 72, 0, 1880);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);

    			if (header_slot_or_fallback) {
    				header_slot_or_fallback.m(header, null);
    			}

    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, footer, anchor);

    			if (footer_slot) {
    				footer_slot.m(footer, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (header_slot) {
    				if (header_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[9], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			} else {
    				if (header_slot_or_fallback && header_slot_or_fallback.p && (!current || dirty & /*$$slots*/ 256)) {
    					header_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (/*$$slots*/ ctx[8].body || /*text*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[9], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot_or_fallback, local);
    			transition_in(if_block);
    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot_or_fallback, local);
    			transition_out(if_block);
    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (header_slot_or_fallback) header_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(footer);
    			if (footer_slot) footer_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DialogContent', slots, ['header','body','footer']);
    	const $$slots = compute_slots(slots);
    	const { headerClass, titleClass, titleId, title, text, dividerClass, bodyClass, footerClass } = getOptions();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DialogContent> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getOptions,
    		headerClass,
    		titleClass,
    		titleId,
    		title,
    		text,
    		dividerClass,
    		bodyClass,
    		footerClass
    	});

    	return [
    		headerClass,
    		titleClass,
    		titleId,
    		title,
    		text,
    		dividerClass,
    		bodyClass,
    		footerClass,
    		$$slots,
    		$$scope,
    		slots
    	];
    }

    class DialogContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DialogContent",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* node_modules/svelte-dialogs/src/components/Alert.svelte generated by Svelte v3.49.0 */
    const file$c = "node_modules/svelte-dialogs/src/components/Alert.svelte";

    // (19:2) <svelte:fragment slot="footer">
    function create_footer_slot$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", /*dismissButtonClass*/ ctx[1]);
    			attr_dev(button, "aria-label", "Dismiss alert");
    			attr_dev(button, "data-testid", "alert__dismiss-button");
    			add_location(button, file$c, 19, 4, 526);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			button.innerHTML = /*dismissButtonText*/ ctx[2];

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot$2.name,
    		type: "slot",
    		source: "(19:2) <svelte:fragment slot=\\\"footer\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let dialogcontent;
    	let current;

    	dialogcontent = new DialogContent({
    			props: {
    				$$slots: { footer: [create_footer_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialogcontent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialogcontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dialogcontent_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				dialogcontent_changes.$$scope = { dirty, ctx };
    			}

    			dialogcontent.$set(dialogcontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialogcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialogcontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Alert', slots, []);
    	const close = getClose();

    	/** retrieve options from context */
    	const { dismissButtonClass, dismissButtonText } = getOptions();

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Alert> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => close();

    	$$self.$capture_state = () => ({
    		DialogContent,
    		getClose,
    		getOptions,
    		close,
    		dismissButtonClass,
    		dismissButtonText
    	});

    	return [close, dismissButtonClass, dismissButtonText, click_handler];
    }

    class Alert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Alert",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* node_modules/svelte-dialogs/src/components/Confirm.svelte generated by Svelte v3.49.0 */
    const file$b = "node_modules/svelte-dialogs/src/components/Confirm.svelte";

    // (20:2) <svelte:fragment slot="footer">
    function create_footer_slot$1(ctx) {
    	let button0;
    	let t;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			t = space();
    			button1 = element("button");
    			attr_dev(button0, "class", /*declineButtonClass*/ ctx[1]);
    			attr_dev(button0, "aria-label", "Decline");
    			attr_dev(button0, "data-testid", "confirm__decline-button");
    			add_location(button0, file$b, 20, 4, 596);
    			attr_dev(button1, "class", /*confirmButtonClass*/ ctx[3]);
    			attr_dev(button1, "aria-label", "Confirm");
    			attr_dev(button1, "data-testid", "confirm__confirm-button");
    			add_location(button1, file$b, 26, 4, 788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			button0.innerHTML = /*declineButtonText*/ ctx[2];
    			insert_dev(target, t, anchor);
    			insert_dev(target, button1, anchor);
    			button1.innerHTML = /*confirmButtonText*/ ctx[4];

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot$1.name,
    		type: "slot",
    		source: "(20:2) <svelte:fragment slot=\\\"footer\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let dialogcontent;
    	let current;

    	dialogcontent = new DialogContent({
    			props: {
    				$$slots: { footer: [create_footer_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dialogcontent.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialogcontent, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const dialogcontent_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				dialogcontent_changes.$$scope = { dirty, ctx };
    			}

    			dialogcontent.$set(dialogcontent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialogcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialogcontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Confirm', slots, []);
    	const close = getClose();

    	/** retrieve options from context */
    	const { declineButtonClass, declineButtonText, confirmButtonClass, confirmButtonText } = getOptions();

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Confirm> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => close(false);
    	const click_handler_1 = () => close(true);

    	$$self.$capture_state = () => ({
    		DialogContent,
    		getClose,
    		getOptions,
    		close,
    		declineButtonClass,
    		declineButtonText,
    		confirmButtonClass,
    		confirmButtonText
    	});

    	return [
    		close,
    		declineButtonClass,
    		declineButtonText,
    		confirmButtonClass,
    		confirmButtonText,
    		click_handler,
    		click_handler_1
    	];
    }

    class Confirm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Confirm",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /**
     * Calls out transitions before destroying the component instance
     * Workaround for https://github.com/sveltejs/svelte/issues/4056
     * @param {SvelteComponent} instance - the svelte component instance
     */
    const outroAndDestroy = (instance) => {
      if (instance.$$.fragment && instance.$$.fragment.o) {
        group_outros();
        transition_out(instance.$$.fragment, 0, 0, () => {
          instance.$destroy();
        });
        check_outros();
      } else {
        instance.$destroy();
      }
    };

    /**
     * Utility function to resolve strings to svelte transitions functions.
     * It modifies the transition in the configuration object if is a string,
     * and that's ok: doing so it needs to resolve them only the first time
     * it's passed to this function
     * @param {object} transitions - the transitions object from configuration
     * @param {(string|function)} transitions.transition - the transitions object from configuration
     * @returns {object} - the transitions object from configuration
     * @throws {Error} - not an existing svelte transition
     */
    const resolveConfigTransitions = (transitions) => {
      for (const key in transitions) {
        const point = transitions[key];
        if (point && typeof point.transition === "string") {
          const transition = svelteTransitions[point.transition];
          if (!transition) throw new Error(`${point.transition} not an existing svelte transition`);
          point.transition = transition;
        }
      }
      return transitions;
    };

    /**
     * Utility function to apply a transition from the transitions congiguration object
     * to an html target
     * @param {Element} node - the document element target of the transition
     * @param {object} point - the transitions configuration object point of application
     * @param {function} point.transition - svelte transition function to apply
     * @param {object} point.props - props for the svelte transition function
     * @returns {TransitionConfig} - the configuration for the transition used by svelte
     */
    const applyTransition = (node, point) => {
      if (!point) return null;
      const { transition, props } = point;
      if (!transition) return null;
      return transition(node, props);
    };

    /**
     * Utility function to map the initial values of prompt input.
     * If not given, return defaults for different input types.
     * @param {object} input - the input object
     * @param {object} input.props - the input object props
     * @param {object} input.props.value - the input object given initial value
     * @param {object} input.props.type - the input object type
     * @returns {any} - the input initial value
     */
    const inputInitialValueMapping = ({ props }) => {
      const { type, value, multiple } = props;
      /** if there is an initial value, use that */
      if (value) return value;
      /** if not, use the type default */
      if (type === "checkbox") return false;
      if (type === "select" && multiple) return [];
      return undefined;
    };

    /**
     * Utility function to map the input argument of prompt().
     * @param {(string|function|object)} input - the input argument of prompt()
     * @returns {object} - the configuration object to be merged with other configuration.
     */
    const promptInputMapping = (input) => {
      if (typeof input === "string") {
        /** if input is string, use it as label */
        return { props: { label: input } };
      } else if (typeof input === "function") {
        /** if input is SvelteComponent, use it as content */
        return { component: input, props: {} };
      } else if (!input.props && !input.component) {
        /** if input is object without props and component, use it as component props */
        return { props: input };
      } else {
        /** if input is object use it as input option */
        return input;
      }
    };

    /**
     * Utility function to add props to inputs props from prompt()
     * @param {object[]} inputs - the inputs with base configuration
     * @param {object} opts - the options for the given component
     * @returns {object[]} - the inputs with enriched props
     */
    const getInputsWithProps = (inputs, opts) => {
      const { inputComponent, inputProps, formElementClass, inputLabelClass, inputClass } = opts;

      /** merge custom inputProps with default config options */
      const defaultProps = {
        label: "",
        formElementClass,
        inputLabelClass,
        inputClass,
        ...inputProps,
      };

      return inputs.map(({ component, props }) => {
        /**
         * If there is a custom component passed in caller,
         * use it without default or configured props
         */
        if (component && component !== inputComponent) return { component, props };

        /** else merge the passed props with the default ones */
        return {
          component: inputComponent,
          props: {
            ...defaultProps,
            ...props,
          },
        };
      });
    };

    /**
     * Utility function to get the description from an option in DialogInput
     * @param {(string|object)} option - the option
     * @returns {string} - the description
     */
    const optionDescription = (option) =>
      typeof option === "string" ? option : option.description ?? "";

    /**
     * Utility function to check if an option is the selected
     * @param {(string|object)} selected - the selected option
     * @param {(string|object)} option - the option to check
     * @returns {boolean} - if the option is the selected one
     */
    const optionCompare = (selected, option) =>
      typeof option === "string" ? selected === option : selected.value === option.value;

    /**
     * Utility function to check if an option is among the selected
     * @param {(string|object)} selected - the selected option
     * @param {(string|object)} option - the option to check
     * @returns {boolean} - if the option is the selected one
     */
    const optionCompareMultiple = (value, option) =>
      !!value.find((selected) => optionCompare(selected, option));

    /**
     * Utility function to retrieve the compare function based on the multiple attribute
     * @param {boolean} multiple - the multiple attribute value
     * @returns {function} - the function to check an option against the DialogInput value
     */
    const getOptionCompare = (multiple) => (multiple ? optionCompareMultiple : optionCompare);

    /**
     * Utility function to create random ids
     * @returns {string} - the id
     */
    const randomId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

    /* node_modules/svelte-dialogs/src/components/DialogInput.svelte generated by Svelte v3.49.0 */

    const file$a = "node_modules/svelte-dialogs/src/components/DialogInput.svelte";

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (51:2) {#if type !== "radio"}
    function create_if_block_6(ctx) {
    	let label_1;
    	let t0;
    	let t1_value = (/*required*/ ctx[8] ? " *" : "") + "";
    	let t1;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[1]);
    			t1 = text(t1_value);
    			attr_dev(label_1, "class", /*inputLabelClass*/ ctx[4]);
    			attr_dev(label_1, "data-testid", "dialog-input__label");
    			attr_dev(label_1, "for", /*id*/ ctx[2]);
    			add_location(label_1, file$a, 51, 4, 1230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t0);
    			append_dev(label_1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

    			if (dirty & /*inputLabelClass*/ 16) {
    				attr_dev(label_1, "class", /*inputLabelClass*/ ctx[4]);
    			}

    			if (dirty & /*id*/ 4) {
    				attr_dev(label_1, "for", /*id*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(51:2) {#if type !== \\\"radio\\\"}",
    		ctx
    	});

    	return block;
    }

    // (127:2) {:else}
    function create_else_block_1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ id: /*id*/ ctx[2] },
    		{ class: /*inputClass*/ ctx[5] },
    		{ "data-testid": "dialog-input__input" },
    		/*$$restProps*/ ctx[11]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 127, 4, 3397);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[19]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty & /*id*/ 4 && { id: /*id*/ ctx[2] },
    				dirty & /*inputClass*/ 32 && { class: /*inputClass*/ ctx[5] },
    				{ "data-testid": "dialog-input__input" },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));

    			if (dirty & /*value, options*/ 65 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(127:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (109:29) 
    function create_if_block_5(ctx) {
    	let fieldset;
    	let legend;
    	let t0;
    	let t1_value = (/*required*/ ctx[8] ? " *" : "") + "";
    	let t1;
    	let t2;
    	let each_value_2 = /*options*/ ctx[6];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			legend = element("legend");
    			t0 = text(/*label*/ ctx[1]);
    			t1 = text(t1_value);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(legend, "data-testid", "dialog-input__legend");
    			add_location(legend, file$a, 110, 6, 2863);
    			attr_dev(fieldset, "data-testid", "dialog-input__fieldset");
    			add_location(fieldset, file$a, 109, 4, 2809);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, legend);
    			append_dev(legend, t0);
    			append_dev(legend, t1);
    			append_dev(fieldset, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(fieldset, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

    			if (dirty & /*id, options, inputClass, $$restProps, value, inputLabelClass, optionDescription*/ 2165) {
    				each_value_2 = /*options*/ ctx[6];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(fieldset, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(109:29) ",
    		ctx
    	});

    	return block;
    }

    // (83:30) 
    function create_if_block_3(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*multiple*/ ctx[9]) return create_if_block_4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(83:30) ",
    		ctx
    	});

    	return block;
    }

    // (74:28) 
    function create_if_block_2$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ type: "file" },
    		{ id: /*id*/ ctx[2] },
    		{ class: /*inputClass*/ ctx[5] },
    		{ "data-testid": "dialog-input__input" },
    		/*$$restProps*/ ctx[11]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 74, 4, 1760);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_1*/ ctx[14]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "file" },
    				dirty & /*id*/ 4 && { id: /*id*/ ctx[2] },
    				dirty & /*inputClass*/ 32 && { class: /*inputClass*/ ctx[5] },
    				{ "data-testid": "dialog-input__input" },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(74:28) ",
    		ctx
    	});

    	return block;
    }

    // (65:32) 
    function create_if_block_1$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ type: "checkbox" },
    		{ id: /*id*/ ctx[2] },
    		{ class: /*inputClass*/ ctx[5] },
    		{ "data-testid": "dialog-input__input" },
    		/*$$restProps*/ ctx[11]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$a, 65, 4, 1565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = /*value*/ ctx[0];

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[13]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "checkbox" },
    				dirty & /*id*/ 4 && { id: /*id*/ ctx[2] },
    				dirty & /*inputClass*/ 32 && { class: /*inputClass*/ ctx[5] },
    				{ "data-testid": "dialog-input__input" },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));

    			if (dirty & /*value, options*/ 65) {
    				input.checked = /*value*/ ctx[0];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(65:32) ",
    		ctx
    	});

    	return block;
    }

    // (57:2) {#if type === "textarea"}
    function create_if_block$6(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		{ id: /*id*/ ctx[2] },
    		{ class: /*inputClass*/ ctx[5] },
    		{ "data-testid": "dialog-input__input" },
    		/*$$restProps*/ ctx[11]
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			add_location(textarea, file$a, 57, 4, 1395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			if (textarea.autofocus) textarea.focus();
    			set_input_value(textarea, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[12]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty & /*id*/ 4 && { id: /*id*/ ctx[2] },
    				dirty & /*inputClass*/ 32 && { class: /*inputClass*/ ctx[5] },
    				{ "data-testid": "dialog-input__input" },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));

    			if (dirty & /*value, options*/ 65) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(57:2) {#if type === \\\"textarea\\\"}",
    		ctx
    	});

    	return block;
    }

    // (112:6) {#each options as option, idx}
    function create_each_block_2(ctx) {
    	let label_1;
    	let t0_value = optionDescription(/*option*/ ctx[22]) + "";
    	let t0;
    	let label_1_for_value;
    	let t1;
    	let input;
    	let input_id_value;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ type: "radio" },
    		{
    			id: input_id_value = /*id*/ ctx[2] + /*idx*/ ctx[28]
    		},
    		{
    			__value: input_value_value = /*option*/ ctx[22]
    		},
    		{ class: /*inputClass*/ ctx[5] },
    		{ "data-testid": "dialog-input__input" },
    		/*$$restProps*/ ctx[11]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			input = element("input");
    			attr_dev(label_1, "class", /*inputLabelClass*/ ctx[4]);
    			attr_dev(label_1, "data-testid", "dialog-input__label");
    			attr_dev(label_1, "for", label_1_for_value = /*id*/ ctx[2] + /*idx*/ ctx[28]);
    			add_location(label_1, file$a, 112, 8, 2990);
    			set_attributes(input, input_data);
    			/*$$binding_groups*/ ctx[18][0].push(input);
    			add_location(input, file$a, 115, 8, 3134);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			input.checked = input.__value === /*value*/ ctx[0];

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler_2*/ ctx[17]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 64 && t0_value !== (t0_value = optionDescription(/*option*/ ctx[22]) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*inputLabelClass*/ 16) {
    				attr_dev(label_1, "class", /*inputLabelClass*/ ctx[4]);
    			}

    			if (dirty & /*id*/ 4 && label_1_for_value !== (label_1_for_value = /*id*/ ctx[2] + /*idx*/ ctx[28])) {
    				attr_dev(label_1, "for", label_1_for_value);
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "radio" },
    				dirty & /*id*/ 4 && input_id_value !== (input_id_value = /*id*/ ctx[2] + /*idx*/ ctx[28]) && { id: input_id_value },
    				dirty & /*options*/ 64 && input_value_value !== (input_value_value = /*option*/ ctx[22]) && { __value: input_value_value },
    				dirty & /*inputClass*/ 32 && { class: /*inputClass*/ ctx[5] },
    				{ "data-testid": "dialog-input__input" },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));

    			if (dirty & /*value, options*/ 65) {
    				input.checked = input.__value === /*value*/ ctx[0];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			/*$$binding_groups*/ ctx[18][0].splice(/*$$binding_groups*/ ctx[18][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(112:6) {#each options as option, idx}",
    		ctx
    	});

    	return block;
    }

    // (100:4) {:else}
    function create_else_block$3(ctx) {
    	let select;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*options*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let select_levels = [
    		{ id: /*id*/ ctx[2] },
    		{ class: /*inputClass*/ ctx[5] },
    		{ "data-testid": "dialog-input__input" },
    		/*$$restProps*/ ctx[11]
    	];

    	let select_data = {};

    	for (let i = 0; i < select_levels.length; i += 1) {
    		select_data = assign(select_data, select_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_attributes(select, select_data);
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler_1*/ ctx[16].call(select));
    			add_location(select, file$a, 100, 6, 2445);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			(select_data.multiple ? select_options : select_option)(select, select_data.value);
    			if (select.autofocus) select.focus();
    			select_option(select, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler_1*/ ctx[16]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options, isSelected, optionDescription*/ 1088) {
    				each_value_1 = /*options*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			set_attributes(select, select_data = get_spread_update(select_levels, [
    				dirty & /*id*/ 4 && { id: /*id*/ ctx[2] },
    				dirty & /*inputClass*/ 32 && { class: /*inputClass*/ ctx[5] },
    				{ "data-testid": "dialog-input__input" },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));

    			if (dirty & /*id, inputClass, $$restProps*/ 2084 && 'value' in select_data) (select_data.multiple ? select_options : select_option)(select, select_data.value);

    			if (dirty & /*value, options*/ 65) {
    				select_option(select, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(100:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (84:4) {#if multiple}
    function create_if_block_4(ctx) {
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*options*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "id", /*id*/ ctx[2]);
    			attr_dev(select, "class", /*inputClass*/ ctx[5]);
    			attr_dev(select, "data-testid", "dialog-input__input");
    			select.required = /*required*/ ctx[8];
    			select.multiple = true;
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[15].call(select));
    			add_location(select, file$a, 85, 6, 2049);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_options(select, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[15]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options, isSelected, optionDescription*/ 1088) {
    				each_value = /*options*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*id*/ 4) {
    				attr_dev(select, "id", /*id*/ ctx[2]);
    			}

    			if (dirty & /*inputClass*/ 32) {
    				attr_dev(select, "class", /*inputClass*/ ctx[5]);
    			}

    			if (dirty & /*value, options*/ 65) {
    				select_options(select, /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(84:4) {#if multiple}",
    		ctx
    	});

    	return block;
    }

    // (102:8) {#each options as option}
    function create_each_block_1(ctx) {
    	let option;
    	let t0_value = optionDescription(/*option*/ ctx[22]) + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*option*/ ctx[22];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*isSelected*/ ctx[10](/*option*/ ctx[22]);
    			attr_dev(option, "data-testid", "dialog-input__option");
    			add_location(option, file$a, 102, 10, 2584);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 64 && t0_value !== (t0_value = optionDescription(/*option*/ ctx[22]) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*options*/ 64 && option_value_value !== (option_value_value = /*option*/ ctx[22])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty & /*options*/ 64 && option_selected_value !== (option_selected_value = /*isSelected*/ ctx[10](/*option*/ ctx[22]))) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(102:8) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    // (94:8) {#each options as option}
    function create_each_block$3(ctx) {
    	let option;
    	let t0_value = optionDescription(/*option*/ ctx[22]) + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*option*/ ctx[22];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*isSelected*/ ctx[10](/*option*/ ctx[22]);
    			attr_dev(option, "data-testid", "dialog-input__option");
    			add_location(option, file$a, 94, 10, 2246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 64 && t0_value !== (t0_value = optionDescription(/*option*/ ctx[22]) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*options*/ 64 && option_value_value !== (option_value_value = /*option*/ ctx[22])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty & /*options*/ 64 && option_selected_value !== (option_selected_value = /*isSelected*/ ctx[10](/*option*/ ctx[22]))) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(94:8) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let t;
    	let if_block0 = /*type*/ ctx[7] !== "radio" && create_if_block_6(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[7] === "textarea") return create_if_block$6;
    		if (/*type*/ ctx[7] === "checkbox") return create_if_block_1$3;
    		if (/*type*/ ctx[7] === "file") return create_if_block_2$2;
    		if (/*type*/ ctx[7] === "select") return create_if_block_3;
    		if (/*type*/ ctx[7] === "radio") return create_if_block_5;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			attr_dev(div, "class", /*formElementClass*/ ctx[3]);
    			attr_dev(div, "data-testid", "dialog-input__form-element");
    			add_location(div, file$a, 49, 0, 1129);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if_block1.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*type*/ ctx[7] !== "radio") if_block0.p(ctx, dirty);
    			if_block1.p(ctx, dirty);

    			if (dirty & /*formElementClass*/ 8) {
    				attr_dev(div, "class", /*formElementClass*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"value","label","id","formElementClass","inputLabelClass","inputClass","options"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DialogInput', slots, []);
    	let { value = inputInitialValueMapping({ props: $$props }) } = $$props;
    	let { label = "" } = $$props;
    	let { id = randomId() } = $$props;
    	let { formElementClass = "" } = $$props;
    	let { inputLabelClass = "" } = $$props;
    	let { inputClass = "" } = $$props;
    	let { options = [] } = $$props;

    	/**
     * workaround: type cannot be set dinamicaly
     */
    	const { type, required, multiple } = $$restProps;

    	/**
     * Compare function based on multiple attribute
     */
    	const optionCompare = getOptionCompare(multiple);

    	/**
     * Selected logic for select
     * @param {object} option - the option
     */
    	function isSelected(option) {
    		if (!value) return false;
    		return optionCompare(value, option);
    	}

    	const $$binding_groups = [[]];

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    		$$invalidate(6, options);
    	}

    	function input_change_handler() {
    		value = this.checked;
    		$$invalidate(0, value);
    		$$invalidate(6, options);
    	}

    	function input_change_handler_1() {
    		value = this.files;
    		$$invalidate(0, value);
    		$$invalidate(6, options);
    	}

    	function select_change_handler() {
    		value = select_multiple_value(this);
    		$$invalidate(0, value);
    		$$invalidate(6, options);
    	}

    	function select_change_handler_1() {
    		value = select_value(this);
    		$$invalidate(0, value);
    		$$invalidate(6, options);
    	}

    	function input_change_handler_2() {
    		value = this.__value;
    		$$invalidate(0, value);
    		$$invalidate(6, options);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    		$$invalidate(6, options);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('label' in $$new_props) $$invalidate(1, label = $$new_props.label);
    		if ('id' in $$new_props) $$invalidate(2, id = $$new_props.id);
    		if ('formElementClass' in $$new_props) $$invalidate(3, formElementClass = $$new_props.formElementClass);
    		if ('inputLabelClass' in $$new_props) $$invalidate(4, inputLabelClass = $$new_props.inputLabelClass);
    		if ('inputClass' in $$new_props) $$invalidate(5, inputClass = $$new_props.inputClass);
    		if ('options' in $$new_props) $$invalidate(6, options = $$new_props.options);
    	};

    	$$self.$capture_state = () => ({
    		inputInitialValueMapping,
    		optionDescription,
    		getOptionCompare,
    		randomId,
    		value,
    		label,
    		id,
    		formElementClass,
    		inputLabelClass,
    		inputClass,
    		options,
    		type,
    		required,
    		multiple,
    		optionCompare,
    		isSelected
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), $$new_props));
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('label' in $$props) $$invalidate(1, label = $$new_props.label);
    		if ('id' in $$props) $$invalidate(2, id = $$new_props.id);
    		if ('formElementClass' in $$props) $$invalidate(3, formElementClass = $$new_props.formElementClass);
    		if ('inputLabelClass' in $$props) $$invalidate(4, inputLabelClass = $$new_props.inputLabelClass);
    		if ('inputClass' in $$props) $$invalidate(5, inputClass = $$new_props.inputClass);
    		if ('options' in $$props) $$invalidate(6, options = $$new_props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		value,
    		label,
    		id,
    		formElementClass,
    		inputLabelClass,
    		inputClass,
    		options,
    		type,
    		required,
    		multiple,
    		isSelected,
    		$$restProps,
    		textarea_input_handler,
    		input_change_handler,
    		input_change_handler_1,
    		select_change_handler,
    		select_change_handler_1,
    		input_change_handler_2,
    		$$binding_groups,
    		input_input_handler
    	];
    }

    class DialogInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			value: 0,
    			label: 1,
    			id: 2,
    			formElementClass: 3,
    			inputLabelClass: 4,
    			inputClass: 5,
    			options: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DialogInput",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get value() {
    		throw new Error("<DialogInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<DialogInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<DialogInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<DialogInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<DialogInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<DialogInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formElementClass() {
    		throw new Error("<DialogInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formElementClass(value) {
    		throw new Error("<DialogInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputLabelClass() {
    		throw new Error("<DialogInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputLabelClass(value) {
    		throw new Error("<DialogInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputClass() {
    		throw new Error("<DialogInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputClass(value) {
    		throw new Error("<DialogInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<DialogInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<DialogInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-dialogs/src/components/Prompt.svelte generated by Svelte v3.49.0 */
    const file$9 = "node_modules/svelte-dialogs/src/components/Prompt.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i].component;
    	child_ctx[19] = list[i].props;
    	child_ctx[20] = list;
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (62:6) {#each inputs as { component, props }
    function create_each_block$2(ctx) {
    	let switch_instance;
    	let updating_value;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[19]];

    	function switch_instance_value_binding(value) {
    		/*switch_instance_value_binding*/ ctx[17](value, /*idx*/ ctx[21]);
    	}

    	var switch_value = /*component*/ ctx[18];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		if (/*$form$*/ ctx[2][/*idx*/ ctx[21]] !== void 0) {
    			switch_instance_props.value = /*$form$*/ ctx[2][/*idx*/ ctx[21]];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind$1(switch_instance, 'value', switch_instance_value_binding));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const switch_instance_changes = (dirty & /*inputs*/ 1)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[19])])
    			: {};

    			if (!updating_value && dirty & /*$form$*/ 4) {
    				updating_value = true;
    				switch_instance_changes.value = /*$form$*/ ctx[2][/*idx*/ ctx[21]];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (switch_value !== (switch_value = /*component*/ ctx[18])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind$1(switch_instance, 'value', switch_instance_value_binding));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(62:6) {#each inputs as { component, props }",
    		ctx
    	});

    	return block;
    }

    // (61:4) <svelte:fragment slot="body">
    function create_body_slot(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*inputs*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputs, $form$*/ 5) {
    				each_value = /*inputs*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_body_slot.name,
    		type: "slot",
    		source: "(61:4) <svelte:fragment slot=\\\"body\\\">",
    		ctx
    	});

    	return block;
    }

    // (75:8) {#if resetButton}
    function create_if_block$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", /*resetButtonClass*/ ctx[8]);
    			attr_dev(button, "aria-label", "Reset form");
    			attr_dev(button, "data-testid", "prompt__reset-button");
    			add_location(button, file$9, 75, 10, 2046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			button.innerHTML = /*resetButtonText*/ ctx[9];

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleReset*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(75:8) {#if resetButton}",
    		ctx
    	});

    	return block;
    }

    // (66:4) <svelte:fragment slot="footer">
    function create_footer_slot(ctx) {
    	let div0;
    	let button0;
    	let t0;
    	let t1;
    	let div1;
    	let button1;
    	let mounted;
    	let dispose;
    	let if_block = /*resetButton*/ ctx[7] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button0 = element("button");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			button1 = element("button");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", /*cancelButtonClass*/ ctx[5]);
    			attr_dev(button0, "aria-label", "Cancel");
    			attr_dev(button0, "data-testid", "prompt__cancel-button");
    			add_location(button0, file$9, 67, 8, 1782);
    			attr_dev(div0, "class", "dialog__button-container");
    			add_location(div0, file$9, 66, 6, 1735);
    			attr_dev(button1, "type", "submit");
    			attr_dev(button1, "class", /*submitButtonClass*/ ctx[10]);
    			attr_dev(button1, "aria-label", "Submit");
    			attr_dev(button1, "data-testid", "prompt__submit-button");
    			add_location(button1, file$9, 85, 8, 2361);
    			attr_dev(div1, "class", "dialog__button-container");
    			add_location(div1, file$9, 84, 6, 2314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button0);
    			button0.innerHTML = /*cancelButtonText*/ ctx[6];
    			append_dev(div0, t0);
    			if (if_block) if_block.m(div0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button1);
    			button1.innerHTML = /*submitButtonText*/ ctx[11];

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*resetButton*/ ctx[7]) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot.name,
    		type: "slot",
    		source: "(66:4) <svelte:fragment slot=\\\"footer\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let form;
    	let dialogcontent;
    	let current;
    	let mounted;
    	let dispose;

    	dialogcontent = new DialogContent({
    			props: {
    				$$slots: {
    					footer: [create_footer_slot],
    					body: [create_body_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			create_component(dialogcontent.$$.fragment);
    			attr_dev(form, "data-testid", "prompt__form");
    			attr_dev(form, "class", /*formClass*/ ctx[4]);
    			toggle_class(form, "touched", /*touched*/ ctx[1]);
    			add_location(form, file$9, 53, 0, 1357);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			mount_component(dialogcontent, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[13]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const dialogcontent_changes = {};

    			if (dirty & /*$$scope, touched, inputs, $form$*/ 4194311) {
    				dialogcontent_changes.$$scope = { dirty, ctx };
    			}

    			dialogcontent.$set(dialogcontent_changes);

    			if (dirty & /*touched*/ 2) {
    				toggle_class(form, "touched", /*touched*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialogcontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialogcontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(dialogcontent);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $form$;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Prompt', slots, []);
    	let { inputs = [] } = $$props;

    	/** flag touched class on submit to show errors in inputs */
    	let touched = false;

    	/** retrieve close function from context */
    	const close = getClose();

    	/** retrieve options from context */
    	const { formClass, cancelButtonClass, cancelButtonText, resetButton, resetButtonClass, resetButtonText, submitButtonClass, submitButtonText } = getOptions();

    	/** maps inputs and create form observable */
    	const form$ = writable(inputs.map(inputInitialValueMapping));

    	validate_store(form$, 'form$');
    	component_subscribe($$self, form$, value => $$invalidate(2, $form$ = value));

    	/**
     * Calls close with form values
     */
    	function handleSubmit() {
    		close(get_store_value(form$));
    	}

    	/**
     * Reset the form values to the initial mapping and reset touched to false
     */
    	function handleReset() {
    		form$.set(inputs.map(inputInitialValueMapping));
    		$$invalidate(1, touched = false);
    	}

    	const writable_props = ['inputs'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Prompt> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => close(null);

    	const click_handler_1 = () => {
    		$$invalidate(1, touched = true);
    	};

    	function switch_instance_value_binding(value, idx) {
    		if ($$self.$$.not_equal($form$[idx], value)) {
    			$form$[idx] = value;
    			form$.set($form$);
    		}
    	}

    	$$self.$$set = $$props => {
    		if ('inputs' in $$props) $$invalidate(0, inputs = $$props.inputs);
    	};

    	$$self.$capture_state = () => ({
    		DialogContent,
    		getClose,
    		getOptions,
    		inputInitialValueMapping,
    		writable,
    		get: get_store_value,
    		inputs,
    		touched,
    		close,
    		formClass,
    		cancelButtonClass,
    		cancelButtonText,
    		resetButton,
    		resetButtonClass,
    		resetButtonText,
    		submitButtonClass,
    		submitButtonText,
    		form$,
    		handleSubmit,
    		handleReset,
    		$form$
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputs' in $$props) $$invalidate(0, inputs = $$props.inputs);
    		if ('touched' in $$props) $$invalidate(1, touched = $$props.touched);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		inputs,
    		touched,
    		$form$,
    		close,
    		formClass,
    		cancelButtonClass,
    		cancelButtonText,
    		resetButton,
    		resetButtonClass,
    		resetButtonText,
    		submitButtonClass,
    		submitButtonText,
    		form$,
    		handleSubmit,
    		handleReset,
    		click_handler,
    		click_handler_1,
    		switch_instance_value_binding
    	];
    }

    class Prompt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { inputs: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prompt",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get inputs() {
    		throw new Error("<Prompt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputs(value) {
    		throw new Error("<Prompt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const commonDefaultOptions = {
      props: {},
      //
      transitions: {
        bgIn: {
          transition: fade,
          props: {},
        },
        bgOut: {
          transition: fade,
          props: {},
        },
        in: {
          transition: fly,
          props: {
            y: 200,
            duration: 500,
          },
        },
        out: {
          transition: fly,
          props: {
            y: 200,
            duration: 500,
          },
        },
      },
      //
      onShow: noop,
      onShown: noop,
      onHide: noop,
      onHidden: noop,
      //
      overlayClass: "dialog__overlay",
      dialogClass: "dialog__container",
      closeButtonClass: "dialog__close-button",
      closeButtonText: "",
      //
      headerClass: "dialog__header",
      titleClass: "dialog__title",
      titleId: "dialog-title-id",
      dividerClass: "dialog-content__divider",
      bodyClass: "dialog__body",
      footerClass: "dialog__footer dialog__footer--space-evenly",
      title: "",
      text: "",
      //
      dismissButtonText: "ok",
      confirmButtonText: "yes",
      declineButtonText: "no",
      dismissButtonClass: "dialog__button dialog__button--primary",
      confirmButtonClass: "dialog__button dialog__button--primary",
      declineButtonClass: "dialog__button dialog__button--decline",
    };

    const defaultDialogOptions = {
      ...commonDefaultOptions,
      //
      content: DialogContent,
      //
      closeButton: true,
      closeOnBg: true,
      closeOnEsc: true,
    };

    const defaultAlertOptions = {
      ...commonDefaultOptions,
      //
      content: Alert,
      //
      closeButton: false,
      closeOnBg: false,
      closeOnEsc: false,
    };

    const defaultConfirmOptions = {
      ...commonDefaultOptions,
      //
      content: Confirm,
      //
      closeButton: false,
      closeOnBg: false,
      closeOnEsc: false,
      title: "are you sure you want to continue?",
    };

    const defaultPromptOptions = {
      ...commonDefaultOptions,
      //
      content: Prompt,
      //
      closeButton: false,
      closeOnBg: false,
      closeOnEsc: false,
      footerClass: "dialog__footer dialog__footer--space-between dialog__footer--mobile-responsive",
      //
      inputComponent: DialogInput,
      inputProps: null,
      resetButton: true,
      formClass: "dialog__form",
      formElementClass: "dialog__form-element",
      inputLabelClass: "dialog__input-label",
      inputClass: "dialog__input",
      submitButtonText: "submit",
      cancelButtonText: "cancel",
      resetButtonText: "reset",
      submitButtonClass: "dialog__button dialog__button--primary",
      cancelButtonClass: "dialog__button dialog__button--decline",
      resetButtonClass: "dialog__button dialog__button--primary",
    };

    const commonContextualOptions = {
      dialogClass: "dialog__container dialog__container--no-padding",
      titleClass: "dialog__title dialog__title--xx-large",
      bodyClass: "dialog__body dialog__body--contextual",
      footerClass: "dialog__footer dialog__footer--space-evenly dialog__footer--contextual",
    };

    const defaultErrorOptions = {
      ...defaultAlertOptions,
      ...commonContextualOptions,
      title: "Error!",
      headerClass: "dialog__header dialog__header--error",
      dismissButtonClass: "dialog__button dialog__button--error",
    };

    const defaultSuccessOptions = {
      ...defaultAlertOptions,
      ...commonContextualOptions,
      title: "Success!",
      headerClass: "dialog__header dialog__header--success",
      dismissButtonClass: "dialog__button dialog__button--success",
    };

    const defaultWarningOptions = {
      ...defaultAlertOptions,
      ...commonContextualOptions,
      title: "Warning!",
      headerClass: "dialog__header dialog__header--warning",
      dismissButtonClass: "dialog__button dialog__button--warning",
    };

    /** default options for each dialog type */
    const defaultDialogConfigOptions = {
      global: defaultDialogOptions,
      alert: defaultAlertOptions,
      confirm: defaultConfirmOptions,
      prompt: defaultPromptOptions,
      error: defaultErrorOptions,
      success: defaultSuccessOptions,
      warning: defaultWarningOptions,
    };

    let customConfig = {};

    /**
     * Sets the user configurations for dialogs
     * @param {object} options - options to set
     * @param {object} options.global - global options
     * @param {object} options.alert - alert options
     * @param {object} options.confirm - confirm options
     * @param {object} options.prompt - prompt options
     * @param {object} options.error - error options
     * @param {object} options.success - success options
     * @param {object} options.warning - warning options
     */
    const config = (options) => {
      customConfig = options;
    };

    /**
     * Resolves the options to be passed at a dialog
     * @param {string} type - configuration type to retrieve
     * @param {object} options - options passed in callers
     * @returns {object} - the resolved options
     */
    const getOpts = (type, options = {}) => {
      /** retrieve configurations for the iven type */
      const defaults = defaultDialogConfigOptions[type];
      const custom = customConfig[type] ?? {};
      const customGlobal = customConfig.global ?? {};

      /**
       * Merge props separately for nested properties.
       * It's not necessary to clone deep, props
       * should be overwritten completely
       */
      const props = {
        ...defaults.props,
        ...customGlobal.props,
        ...custom.props,
        ...options.props,
      };

      /**
       * Merge transitions configuration and
       * resolve the string transitions
       */
      const transitions = resolveConfigTransitions({
        ...defaults.transitions,
        ...customGlobal.transitions,
        ...custom.transitions,
        ...options.transitions,
      });

      /** merge all the options */
      return {
        ...defaults,
        ...customGlobal,
        ...custom,
        ...options,
        props,
        transitions,
      };
    };

    let trapFocusList = [];

    const focusableSelector =
      "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

    if (typeof window !== "undefined") {
      const isNext = (event) => event.key === "Tab" && !event.shiftKey;
      const isPrevious = (event) => event.key === "Tab" && event.shiftKey;
      const trapFocusListener = (event) => {
        /** if the target windows, then focus should work */
        if (event.target === window) {
          return;
        }

        const eventTarget = event.target;

        /** if the target is not a trapped node child, then the parent could't be focused. */
        const parentNode = trapFocusList.find((node) => node.contains(eventTarget));
        if (!parentNode) {
          return;
        }

        /**
         * Search for all focusable children of the node.
         * If there aren't any, then keep focusing the node itself.
         */
        const focusable = parentNode.querySelectorAll(focusableSelector);
        if (!focusable.length) {
          event.preventDefault();
          return;
        }

        /** traps the focus in the focusables */
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (isNext(event) && event.target === last) {
          event.preventDefault();
          first.focus();
        } else if (isPrevious(event) && event.target === first) {
          event.preventDefault();
          last.focus();
        }
      };

      document.addEventListener("keydown", trapFocusListener);
    }

    /**
     * Focus trap svelte action
     * https://gist.github.com/JulienPradet/20dbb7ca06cbd9e2ec499bb2206aab55
     * @param {Element} node - the target html element
     * @returns {object} - the object containing the destroy function
     */
    const focusTrap = (node) => {
      /** makes the current node focusable by javascript */
      node.setAttribute("tabindex", "-1");

      /** search for a focusable in node children. If not present, fous the node */
      const firstFocusable = node.querySelector(focusableSelector);
      firstFocusable ? firstFocusable.focus() : node.focus();

      /** adds the node in the trapped elements */
      trapFocusList.push(node);

      return {
        destroy() {
          /** remove the tabindex attribute and remove the node from the trapped elements */
          node.removeAttribute("tabindex");
          trapFocusList = trapFocusList.filter((element) => element !== node);
        },
      };
    };

    /* node_modules/svelte-dialogs/src/components/DialogCore.svelte generated by Svelte v3.49.0 */
    const file$8 = "node_modules/svelte-dialogs/src/components/DialogCore.svelte";

    // (142:4) {#if closeButton}
    function create_if_block_2$1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", /*closeButtonClass*/ ctx[5]);
    			attr_dev(button, "aria-label", "Close dialog");
    			attr_dev(button, "data-testid", "dialog-core__close-button");
    			add_location(button, file$8, 142, 6, 3046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			button.innerHTML = /*closeButtonText*/ ctx[6];

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[23], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(142:4) {#if closeButton}",
    		ctx
    	});

    	return block;
    }

    // (155:4) {:else}
    function create_else_block$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[8]];
    	var switch_value = /*content*/ ctx[7];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*props*/ 256)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[8])])
    			: {};

    			if (switch_value !== (switch_value = /*content*/ ctx[7])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(155:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (153:42) 
    function create_if_block_1$2(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*content*/ ctx[7], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(153:42) ",
    		ctx
    	});

    	return block;
    }

    // (151:4) {#if $$slots.default}
    function create_if_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 2097152)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(151:4) {#if $$slots.default}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let div0_intro;
    	let div0_outro;
    	let div1_intro;
    	let div1_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*closeButton*/ ctx[4] && create_if_block_2$1(ctx);
    	const if_block_creators = [create_if_block$4, create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$$slots*/ ctx[19].default) return 0;
    		if (typeof /*content*/ ctx[7] === "string") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			attr_dev(div0, "class", /*dialogClass*/ ctx[2]);
    			attr_dev(div0, "role", "dialog");
    			attr_dev(div0, "aria-modal", "true");
    			attr_dev(div0, "aria-labelledby", /*titleId*/ ctx[3]);
    			attr_dev(div0, "data-testid", "dialog-core__dialog");
    			add_location(div0, file$8, 127, 2, 2691);
    			attr_dev(div1, "class", /*overlayClass*/ ctx[1]);
    			attr_dev(div1, "data-testid", "dialog-core__overlay");
    			attr_dev(div1, "tabindex", "-1");
    			add_location(div1, file$8, 118, 0, 2521);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleKeydown*/ ctx[17], false, false, false),
    					listen_dev(div0, "introstart", /*show*/ ctx[13], false, false, false),
    					listen_dev(div0, "introend", /*shown*/ ctx[14], false, false, false),
    					listen_dev(div0, "outrostart", /*hide*/ ctx[15], false, false, false),
    					listen_dev(div0, "outroend", /*hidden*/ ctx[16], false, false, false),
    					listen_dev(div0, "click", handleDialogClick, false, false, false),
    					listen_dev(div1, "click", /*handleBgClick*/ ctx[18], false, false, false),
    					action_destroyer(focusTrap.call(null, div1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*closeButton*/ ctx[4]) if_block0.p(ctx, dirty);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (div0_outro) div0_outro.end(1);
    				div0_intro = create_in_transition(div0, /*dialogInTransition*/ ctx[11], {});
    				div0_intro.start();
    			});

    			add_render_callback(() => {
    				if (div1_outro) div1_outro.end(1);
    				div1_intro = create_in_transition(div1, /*bgInTransition*/ ctx[9], {});
    				div1_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			if (div0_intro) div0_intro.invalidate();
    			div0_outro = create_out_transition(div0, /*dialogOutTransition*/ ctx[12], {});
    			if (div1_intro) div1_intro.invalidate();
    			div1_outro = create_out_transition(div1, /*bgOutTransition*/ ctx[10], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			if (detaching && div0_outro) div0_outro.end();
    			if (detaching && div1_outro) div1_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleDialogClick(event) {
    	event.stopPropagation();
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DialogCore', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	const dispatch = createEventDispatcher();
    	let { close } = $$props;
    	let { opts } = $$props;
    	let { transitions, onShow, onShown, onHide, onHidden, closeOnEsc, closeOnBg, overlayClass, dialogClass, titleId, closeButton, closeButtonClass, closeButtonText, content, props } = opts;

    	/** puts the close function in the context*/
    	setClose(close);

    	/** puts the options in the context*/
    	setOptions(opts);

    	/** apply background in transition */
    	function bgInTransition(node, _) {
    		return applyTransition(node, transitions.bgIn);
    	}

    	/** apply background out transition */
    	function bgOutTransition(node, _) {
    		return applyTransition(node, transitions.bgOut);
    	}

    	/** apply dialog in transition */
    	function dialogInTransition(node, _) {
    		return applyTransition(node, transitions.in);
    	}

    	/** apply dialog out transition */
    	function dialogOutTransition(node, _) {
    		return applyTransition(node, transitions.out);
    	}

    	/** call onShow callback and dispatch show event */
    	function show() {
    		onShow();
    		dispatch("show");
    	}

    	/** call onShown callback and dispatch shown event */
    	function shown() {
    		onShown();
    		dispatch("shown");
    	}

    	/** call onHide callback and dispatch hide event */
    	function hide() {
    		onHide();
    		dispatch("hide");
    	}

    	/** call onHidden callback and dispatch hidden event */
    	function hidden() {
    		onHidden();
    		dispatch("hidden");
    	}

    	/**
     * if closeOnEsc option is true, close the dialog on Escape keydown
     * @param event
     */
    	function handleKeydown(event) {
    		if (closeOnEsc && event.key === "Escape") {
    			event.preventDefault();
    			close();
    		}
    	}

    	/**
     * if closeOnBg option is true, close the dialog on background click
     * @param event
     */
    	function handleBgClick() {
    		if (closeOnBg) {
    			close();
    		}
    	}

    	const writable_props = ['close', 'opts'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DialogCore> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => close();

    	$$self.$$set = $$props => {
    		if ('close' in $$props) $$invalidate(0, close = $$props.close);
    		if ('opts' in $$props) $$invalidate(20, opts = $$props.opts);
    		if ('$$scope' in $$props) $$invalidate(21, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		focusTrap,
    		setClose,
    		setOptions,
    		applyTransition,
    		dispatch,
    		close,
    		opts,
    		transitions,
    		onShow,
    		onShown,
    		onHide,
    		onHidden,
    		closeOnEsc,
    		closeOnBg,
    		overlayClass,
    		dialogClass,
    		titleId,
    		closeButton,
    		closeButtonClass,
    		closeButtonText,
    		content,
    		props,
    		bgInTransition,
    		bgOutTransition,
    		dialogInTransition,
    		dialogOutTransition,
    		show,
    		shown,
    		hide,
    		hidden,
    		handleKeydown,
    		handleBgClick,
    		handleDialogClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('close' in $$props) $$invalidate(0, close = $$props.close);
    		if ('opts' in $$props) $$invalidate(20, opts = $$props.opts);
    		if ('transitions' in $$props) transitions = $$props.transitions;
    		if ('onShow' in $$props) onShow = $$props.onShow;
    		if ('onShown' in $$props) onShown = $$props.onShown;
    		if ('onHide' in $$props) onHide = $$props.onHide;
    		if ('onHidden' in $$props) onHidden = $$props.onHidden;
    		if ('closeOnEsc' in $$props) closeOnEsc = $$props.closeOnEsc;
    		if ('closeOnBg' in $$props) closeOnBg = $$props.closeOnBg;
    		if ('overlayClass' in $$props) $$invalidate(1, overlayClass = $$props.overlayClass);
    		if ('dialogClass' in $$props) $$invalidate(2, dialogClass = $$props.dialogClass);
    		if ('titleId' in $$props) $$invalidate(3, titleId = $$props.titleId);
    		if ('closeButton' in $$props) $$invalidate(4, closeButton = $$props.closeButton);
    		if ('closeButtonClass' in $$props) $$invalidate(5, closeButtonClass = $$props.closeButtonClass);
    		if ('closeButtonText' in $$props) $$invalidate(6, closeButtonText = $$props.closeButtonText);
    		if ('content' in $$props) $$invalidate(7, content = $$props.content);
    		if ('props' in $$props) $$invalidate(8, props = $$props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		close,
    		overlayClass,
    		dialogClass,
    		titleId,
    		closeButton,
    		closeButtonClass,
    		closeButtonText,
    		content,
    		props,
    		bgInTransition,
    		bgOutTransition,
    		dialogInTransition,
    		dialogOutTransition,
    		show,
    		shown,
    		hide,
    		hidden,
    		handleKeydown,
    		handleBgClick,
    		$$slots,
    		opts,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class DialogCore extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { close: 0, opts: 20 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DialogCore",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*close*/ ctx[0] === undefined && !('close' in props)) {
    			console.warn("<DialogCore> was created without expected prop 'close'");
    		}

    		if (/*opts*/ ctx[20] === undefined && !('opts' in props)) {
    			console.warn("<DialogCore> was created without expected prop 'opts'");
    		}
    	}

    	get close() {
    		throw new Error("<DialogCore>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<DialogCore>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opts() {
    		throw new Error("<DialogCore>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opts(value) {
    		throw new Error("<DialogCore>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Renders a DialogCore with html body as target
     * @param {object} opts - configuration object
     * @returns {Promise} - the promise associated with the rendered DialogCore
     */
    const createDialog = (opts) => {
      let close;
      /** create the Promise and et a ref of the resolve method */
      const promise = new Promise((resolve) => {
        close = resolve;
      });

      /**
       * Create a DialogCore instance with options and resolve ref.
       * Target is set to the document body, intro make the
       * transitions work on instance creatrion.
       */
      const dialog = new DialogCore({
        target: document.body,
        intro: true,
        props: {
          close,
          opts,
        },
      });

      /**
       * Retrun the Promise associated with the resolve ref
       * passed as a prop.
       * outroAndDestroy make the transitions work on instance
       * destruction.
       */
      return promise.finally(() => {
        outroAndDestroy(dialog);
      });
    };

    /**
     * Renders a modal
     * @param {(string|function|object)} options - the dialog options
     * @param {object} props - the props of a custom component content
     * @returns {Promise} - the promise associated with the rendered DialogCore
     */
    const modal = (options, props) => {
      let opts;

      if (typeof options === "string" || typeof options === "function") {
        /** if options is a string or a SvelteComponent, use it as content */
        opts = getOpts("global");
        opts.content = options;
        /** used by SvelteComponent, ignored by string content */
        if (props) {
          opts.props = props;
        }
      } else {
        /** if options is an object, it's merged in configuration */
        opts = getOpts("global", options);
      }

      return createDialog(opts);
    };

    /**
     * Renders an alert
     * @param {(string|object)} options - the dialog options
     * @returns {Promise} - the promise associated with the rendered DialogCore
     */
    const alert$1 = (options) => {
      let opts;

      if (typeof options === "string") {
        /** if options is a string, it's used as title option */
        opts = getOpts("alert");
        opts.title = options;
      } else {
        /** if options is an object, it's merged in configuration */
        opts = getOpts("alert", options);
      }

      return createDialog(opts);
    };

    /**
     * Renders a confirm
     * @param {(string|object)} options - the dialog options
     * @returns {Promise} - the promise associated with the rendered DialogCore
     */
    const confirm$1 = (options) => {
      let opts;

      if (typeof options === "string") {
        /** if options is a string, it's used as title option */
        opts = getOpts("confirm");
        opts.title = options;
      } else {
        /** if options is an object, it's merged in configuration */
        opts = getOpts("confirm", options);
      }

      return createDialog(opts);
    };

    /**
     * Renders a prompt
     * @param {(string|object|function)} input - the inputs to be shown in the prompt
     * @param {(object)} options - the dialog options
     * @returns {Promise} - the promise associated with the rendered DialogCore
     */
    const prompt = (input, options) => {
      /** puts input in an array if is not an array already, then map the inputs array */
      const inputs = (Array.isArray(input) ? input : [input]).map(promptInputMapping);
      const opts = getOpts("prompt", options);

      /** set the inputs props of the option */
      opts.props.inputs = getInputsWithProps(inputs, opts);

      return createDialog(opts);
    };

    /**
     * Renders an error
     * @param {(string|object)} options - the dialog options
     * @returns {Promise} - the promise associated with the rendered DialogCore
     */
    const error = (options) => {
      let opts;

      if (typeof options === "string") {
        /** if options is a string, it's used as text option */
        opts = getOpts("error");
        opts.text = options;
      } else {
        /** if options is an object, it's merged in configuration */
        opts = getOpts("error", options);
      }

      return createDialog(opts);
    };

    /**
     * Renders a success
     * @param {(string|object)} options - the dialog options
     * @returns {Promise} - the promise associated with the rendered DialogCore
     */
    const success = (options) => {
      let opts;

      if (typeof options === "string") {
        /** if options is a string, it's used as text option */
        opts = getOpts("success");
        opts.text = options;
      } else {
        /** if options is an object, it's merged in configuration */
        opts = getOpts("success", options);
      }

      return createDialog(opts);
    };

    /**
     * Renders a warning
     * @param {(string|object)} options - the dialog options
     * @returns {Promise} - the promise associated with the rendered DialogCore
     */
    const warning = (options) => {
      let opts;

      if (typeof options === "string") {
        /** if options is a string, it's used as text option */
        opts = getOpts("warning");
        opts.text = options;
      } else {
        /** if options is an object, it's merged in configuration */
        opts = getOpts("warning", options);
      }

      return createDialog(opts);
    };

    const dialogs = { alert: alert$1, confirm: confirm$1, modal, prompt, error, success, warning, config };

    /* src/components/todoList/Item.svelte generated by Svelte v3.49.0 */
    const file$7 = "src/components/todoList/Item.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let span;
    	let t4_value = new Date(/*CreatedAt*/ ctx[3]).toLocaleDateString("en-US") + "";
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*counter*/ ctx[2]);
    			t1 = text(" .    \n  ");
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			span = element("span");
    			t4 = text(t4_value);
    			attr_dev(input0, "class", "text-input svelte-1yn910s");
    			attr_dev(input0, "type", "text");
    			input0.readOnly = /*status*/ ctx[1];
    			add_location(input0, file$7, 23, 2, 576);
    			attr_dev(input1, "class", "complete-checkbox svelte-1yn910s");
    			attr_dev(input1, "type", "checkbox");
    			add_location(input1, file$7, 31, 2, 778);
    			attr_dev(span, "class", "created-at svelte-1yn910s");
    			add_location(span, file$7, 37, 2, 906);
    			attr_dev(div, "class", "item svelte-1yn910s");
    			toggle_class(div, "status", /*status*/ ctx[1]);
    			add_location(div, file$7, 21, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, input0);
    			set_input_value(input0, /*task*/ ctx[0]);
    			append_dev(div, t2);
    			append_dev(div, input1);
    			input1.checked = /*status*/ ctx[1];
    			append_dev(div, t3);
    			append_dev(div, span);
    			append_dev(span, t4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[7]),
    					listen_dev(input0, "keyup", keyup_handler, false, false, false),
    					listen_dev(input0, "blur", /*blur_handler*/ ctx[8], false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[9]),
    					listen_dev(input1, "change", /*change_handler*/ ctx[10], false, false, false),
    					listen_dev(div, "dblclick", /*handleDoubleClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*counter*/ 4) set_data_dev(t0, /*counter*/ ctx[2]);

    			if (dirty & /*status*/ 2) {
    				prop_dev(input0, "readOnly", /*status*/ ctx[1]);
    			}

    			if (dirty & /*task*/ 1 && input0.value !== /*task*/ ctx[0]) {
    				set_input_value(input0, /*task*/ ctx[0]);
    			}

    			if (dirty & /*status*/ 2) {
    				input1.checked = /*status*/ ctx[1];
    			}

    			if (dirty & /*CreatedAt*/ 8 && t4_value !== (t4_value = new Date(/*CreatedAt*/ ctx[3]).toLocaleDateString("en-US") + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*status*/ 2) {
    				toggle_class(div, "status", /*status*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const keyup_handler = ({ key, target }) => key === "Enter" && target.blur();

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Item', slots, []);
    	let { id, task, status, counter, CreatedAt } = $$props;
    	const dispatch = createEventDispatcher();

    	function triggerUpdate() {
    		dispatch("update", { id, task, status });
    	}

    	function handleDoubleClick() {
    		const yes = confirm("Are you sure you wish to delete this item?");

    		if (yes) {
    			dispatch("delete", { id });
    		}
    	}

    	const writable_props = ['id', 'task', 'status', 'counter', 'CreatedAt'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Item> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		task = this.value;
    		$$invalidate(0, task);
    	}

    	const blur_handler = () => triggerUpdate();

    	function input1_change_handler() {
    		status = this.checked;
    		$$invalidate(1, status);
    	}

    	const change_handler = () => triggerUpdate();

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(6, id = $$props.id);
    		if ('task' in $$props) $$invalidate(0, task = $$props.task);
    		if ('status' in $$props) $$invalidate(1, status = $$props.status);
    		if ('counter' in $$props) $$invalidate(2, counter = $$props.counter);
    		if ('CreatedAt' in $$props) $$invalidate(3, CreatedAt = $$props.CreatedAt);
    	};

    	$$self.$capture_state = () => ({
    		dialogs,
    		createEventDispatcher,
    		id,
    		task,
    		status,
    		counter,
    		CreatedAt,
    		dispatch,
    		triggerUpdate,
    		handleDoubleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(6, id = $$props.id);
    		if ('task' in $$props) $$invalidate(0, task = $$props.task);
    		if ('status' in $$props) $$invalidate(1, status = $$props.status);
    		if ('counter' in $$props) $$invalidate(2, counter = $$props.counter);
    		if ('CreatedAt' in $$props) $$invalidate(3, CreatedAt = $$props.CreatedAt);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		task,
    		status,
    		counter,
    		CreatedAt,
    		triggerUpdate,
    		handleDoubleClick,
    		id,
    		input0_input_handler,
    		blur_handler,
    		input1_change_handler,
    		change_handler
    	];
    }

    class Item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			id: 6,
    			task: 0,
    			status: 1,
    			counter: 2,
    			CreatedAt: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Item",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[6] === undefined && !('id' in props)) {
    			console.warn("<Item> was created without expected prop 'id'");
    		}

    		if (/*task*/ ctx[0] === undefined && !('task' in props)) {
    			console.warn("<Item> was created without expected prop 'task'");
    		}

    		if (/*status*/ ctx[1] === undefined && !('status' in props)) {
    			console.warn("<Item> was created without expected prop 'status'");
    		}

    		if (/*counter*/ ctx[2] === undefined && !('counter' in props)) {
    			console.warn("<Item> was created without expected prop 'counter'");
    		}

    		if (/*CreatedAt*/ ctx[3] === undefined && !('CreatedAt' in props)) {
    			console.warn("<Item> was created without expected prop 'CreatedAt'");
    		}
    	}

    	get id() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get task() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set task(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get status() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set status(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get counter() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set counter(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get CreatedAt() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set CreatedAt(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/todoList/Paging.svelte generated by Svelte v3.49.0 */
    const file$6 = "src/components/todoList/Paging.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (19:4) {:else}
    function create_else_block$1(ctx) {
    	let button;
    	let t_value = /*page*/ ctx[7] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[5](/*page*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "page svelte-8vfgjv");
    			add_location(button, file$6, 19, 6, 509);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(19:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#if page === currentPage}
    function create_if_block$3(ctx) {
    	let button;
    	let t_value = /*page*/ ctx[7] + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*page*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "page choosen svelte-8vfgjv");
    			add_location(button, file$6, 15, 6, 393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(15:4) {#if page === currentPage}",
    		ctx
    	});

    	return block;
    }

    // (14:2) {#each pageArr as page (page)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*page*/ ctx[7] === /*currentPage*/ ctx[0]) return create_if_block$3;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(14:2) {#each pageArr as page (page)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*pageArr*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*page*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "pages svelte-8vfgjv");
    			add_location(div, file$6, 12, 0, 303);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*triggerUpdate, pageArr, currentPage*/ 7) {
    				each_value = /*pageArr*/ ctx[1];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$1, null, get_each_context$1);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Paging', slots, []);
    	const dispatch = createEventDispatcher();
    	let { pageLength, currentPage } = $$props;
    	const pageArr = Array.from({ length: pageLength }, (v, i) => i);

    	function triggerUpdate(page) {
    		dispatch("triggerFlip", { page });
    	}

    	const writable_props = ['pageLength', 'currentPage'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Paging> was created with unknown prop '${key}'`);
    	});

    	const click_handler = page => triggerUpdate(page);
    	const click_handler_1 = page => triggerUpdate(page);

    	$$self.$$set = $$props => {
    		if ('pageLength' in $$props) $$invalidate(3, pageLength = $$props.pageLength);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		pageLength,
    		currentPage,
    		pageArr,
    		triggerUpdate
    	});

    	$$self.$inject_state = $$props => {
    		if ('pageLength' in $$props) $$invalidate(3, pageLength = $$props.pageLength);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		currentPage,
    		pageArr,
    		triggerUpdate,
    		pageLength,
    		click_handler,
    		click_handler_1
    	];
    }

    class Paging extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { pageLength: 3, currentPage: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paging",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pageLength*/ ctx[3] === undefined && !('pageLength' in props)) {
    			console.warn("<Paging> was created without expected prop 'pageLength'");
    		}

    		if (/*currentPage*/ ctx[0] === undefined && !('currentPage' in props)) {
    			console.warn("<Paging> was created without expected prop 'currentPage'");
    		}
    	}

    	get pageLength() {
    		throw new Error("<Paging>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageLength(value) {
    		throw new Error("<Paging>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPage() {
    		throw new Error("<Paging>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<Paging>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/todoList/TodoList.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$1, console: console_1$2 } = globals;
    const file$5 = "src/components/todoList/TodoList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (84:0) {:else}
    function create_else_block(ctx) {
    	let filters;
    	let t0;
    	let div3;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t7;
    	let paging;
    	let current;
    	filters = new Filters({ $$inline: true });
    	let each_value = /*$TodoListStore*/ ctx[0].slice(3 * /*currentPage*/ ctx[2], 3 * (/*currentPage*/ ctx[2] + 1));
    	validate_each_argument(each_value);
    	const get_key = ctx => /*todo*/ ctx[9].ID;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	paging = new Paging({
    			props: {
    				pageLength: /*tasksCount*/ ctx[4] / 3 + 1,
    				currentPage: /*currentPage*/ ctx[2]
    			},
    			$$inline: true
    		});

    	paging.$on("triggerFlip", /*triggerFlip*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(filters.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Tasks : ");
    			t3 = text(/*tasksDone*/ ctx[3]);
    			t4 = text("/");
    			t5 = text(/*tasksCount*/ ctx[4]);
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			create_component(paging.$$.fragment);
    			attr_dev(div0, "class", "date");
    			add_location(div0, file$5, 87, 6, 2912);
    			attr_dev(div1, "class", "count");
    			add_location(div1, file$5, 88, 6, 2939);
    			attr_dev(div2, "class", "status svelte-43psse");
    			add_location(div2, file$5, 86, 4, 2885);
    			attr_dev(div3, "class", "list svelte-43psse");
    			add_location(div3, file$5, 85, 2, 2862);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filters, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div3, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(div3, t7);
    			mount_component(paging, div3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*tasksDone*/ 8) set_data_dev(t3, /*tasksDone*/ ctx[3]);
    			if (!current || dirty & /*tasksCount*/ 16) set_data_dev(t5, /*tasksCount*/ ctx[4]);

    			if (dirty & /*$TodoListStore, currentPage, handleDeleteItem, handleUpdateItem*/ 101) {
    				each_value = /*$TodoListStore*/ ctx[0].slice(3 * /*currentPage*/ ctx[2], 3 * (/*currentPage*/ ctx[2] + 1));
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div3, outro_and_destroy_block, create_each_block, t7, get_each_context);
    				check_outros();
    			}

    			const paging_changes = {};
    			if (dirty & /*tasksCount*/ 16) paging_changes.pageLength = /*tasksCount*/ ctx[4] / 3 + 1;
    			if (dirty & /*currentPage*/ 4) paging_changes.currentPage = /*currentPage*/ ctx[2];
    			paging.$set(paging_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filters.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(paging.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filters.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(paging.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filters, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			destroy_component(paging);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(84:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (82:0) {#if error || $TodoListStore.length === 0 || !tasksCount}
    function create_if_block$2(ctx) {
    	let p;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("No Items Exist ");
    			t1 = text(/*error*/ ctx[1]);
    			attr_dev(p, "class", "list-status svelte-43psse");
    			add_location(p, file$5, 82, 2, 2788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 2) set_data_dev(t1, /*error*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(82:0) {#if error || $TodoListStore.length === 0 || !tasksCount}",
    		ctx
    	});

    	return block;
    }

    // (91:4) {#each $TodoListStore.slice(3*currentPage, 3*(currentPage+1)) as todo, index (todo.ID)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let item;
    	let div_intro;
    	let div_outro;
    	let current;

    	item = new Item({
    			props: {
    				counter: /*index*/ ctx[11] + 1,
    				id: /*todo*/ ctx[9].ID,
    				task: /*todo*/ ctx[9].task,
    				status: /*todo*/ ctx[9].status,
    				CreatedAt: /*todo*/ ctx[9].CreatedAt
    			},
    			$$inline: true
    		});

    	item.$on("delete", /*handleDeleteItem*/ ctx[5]);
    	item.$on("update", /*handleUpdateItem*/ ctx[6]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(item.$$.fragment);
    			add_location(div, file$5, 91, 6, 3106);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(item, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const item_changes = {};
    			if (dirty & /*$TodoListStore, currentPage*/ 5) item_changes.counter = /*index*/ ctx[11] + 1;
    			if (dirty & /*$TodoListStore, currentPage*/ 5) item_changes.id = /*todo*/ ctx[9].ID;
    			if (dirty & /*$TodoListStore, currentPage*/ 5) item_changes.task = /*todo*/ ctx[9].task;
    			if (dirty & /*$TodoListStore, currentPage*/ 5) item_changes.status = /*todo*/ ctx[9].status;
    			if (dirty & /*$TodoListStore, currentPage*/ 5) item_changes.CreatedAt = /*todo*/ ctx[9].CreatedAt;
    			item.$set(item_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, scale, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 500 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(item);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(91:4) {#each $TodoListStore.slice(3*currentPage, 3*(currentPage+1)) as todo, index (todo.ID)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*error*/ ctx[1] || /*$TodoListStore*/ ctx[0].length === 0 || !/*tasksCount*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let tasksCount;
    	let tasksDone;
    	let currentPage;
    	let $TodoListStore;
    	let $SettingsStore;
    	validate_store(TodoListStore, 'TodoListStore');
    	component_subscribe($$self, TodoListStore, $$value => $$invalidate(0, $TodoListStore = $$value));
    	validate_store(SettingsStore, 'SettingsStore');
    	component_subscribe($$self, SettingsStore, $$value => $$invalidate(8, $SettingsStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TodoList', slots, []);
    	let error = "";

    	// Deleting Tasks
    	async function handleDeleteItem(event) {
    		let id = event.detail.id;

    		// parse string to int
    		await TodosDataService$1.delete(id);

    		// todo set it to store
    		TodoListStore.set($TodoListStore.filter(t => t.ID !== id));
    	}

    	// Updating Tasks
    	async function handleUpdateItem(event) {
    		let id = event.detail.id;
    		let status = event.detail.status;
    		let task = event.detail.task;

    		await TodosDataService$1.update(id, {
    			ID: id,
    			author: $SettingsStore["name"],
    			status,
    			task
    		});

    		TodoListStore.set($TodoListStore.map(t => t.ID === id
    		? Object.assign(Object.assign({}, t), { status, task })
    		: t));

    		console.log($TodoListStore);
    	}

    	function triggerFlip(event) {
    		alert("page");
    		$$invalidate(2, currentPage = event.detail.page);
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<TodoList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Filters,
    		TodosDataService: TodosDataService$1,
    		SettingsStore,
    		TodoListStore,
    		onMount,
    		fade,
    		scale,
    		SettingsApi: SettingsApi$1,
    		Item,
    		Paging,
    		error,
    		handleDeleteItem,
    		handleUpdateItem,
    		triggerFlip,
    		currentPage,
    		tasksDone,
    		tasksCount,
    		$TodoListStore,
    		$SettingsStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    		if ('currentPage' in $$props) $$invalidate(2, currentPage = $$props.currentPage);
    		if ('tasksDone' in $$props) $$invalidate(3, tasksDone = $$props.tasksDone);
    		if ('tasksCount' in $$props) $$invalidate(4, tasksCount = $$props.tasksCount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$TodoListStore, $SettingsStore*/ 257) {
    			// Getting tasks
    			onMount(async function () {
    				try {
    					// todo make it uuid
    					SettingsApi$1.updateSettings();

    					// todo set it to store
    					console.log("before request @TODOLIST.svelte", $TodoListStore);

    					console.log("before request @TODOLIST.svelte", $SettingsStore);
    					let todoList = (await TodosDataService$1.getByAuthor($SettingsStore["name"])).data;
    					TodoListStore.set(todoList);
    					console.log("after request @TODOLIST.svelte", $TodoListStore);
    					console.log("after request @TODOLIST.svelte requested todolist", todoList);
    					console.log("after request @TODOLIST.svelte name", $SettingsStore["name"]);
    				} catch(err) {
    					$$invalidate(1, error = err.message);
    				}
    			});
    		}

    		if ($$self.$$.dirty & /*$TodoListStore*/ 1) {
    			$$invalidate(4, tasksCount = $TodoListStore.length);
    		}

    		if ($$self.$$.dirty & /*$TodoListStore*/ 1) {
    			$$invalidate(3, tasksDone = $TodoListStore.filter(t => t.status === true).length);
    		}
    	};

    	$$invalidate(2, currentPage = 0);

    	return [
    		$TodoListStore,
    		error,
    		currentPage,
    		tasksDone,
    		tasksCount,
    		handleDeleteItem,
    		handleUpdateItem,
    		triggerFlip,
    		$SettingsStore
    	];
    }

    class TodoList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TodoList",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/form/Card.svelte generated by Svelte v3.49.0 */

    const file$4 = "src/components/form/Card.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card svelte-1orgt8z");
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/form/Form.svelte generated by Svelte v3.49.0 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/components/form/Form.svelte";

    // (79:4) {#if message}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*message*/ ctx[2]);
    			attr_dev(div, "class", "message svelte-3eja2p");
    			add_location(div, file$3, 79, 6, 2101);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 4) set_data_dev(t, /*message*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(79:4) {#if message}",
    		ctx
    	});

    	return block;
    }

    // (84:4) {#if error}
    function create_if_block$1(ctx) {
    	let div;
    	let t_value = /*error*/ ctx[4].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "message svelte-3eja2p");
    			add_location(div, file$3, 84, 6, 2186);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 16 && t_value !== (t_value = /*error*/ ctx[4].message + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(84:4) {#if error}",
    		ctx
    	});

    	return block;
    }

    // (58:0) <Card>
    function create_default_slot(ctx) {
    	let header;
    	let h2;
    	let t0;
    	let t1;
    	let t2;
    	let br;
    	let t3;
    	let t4;
    	let t5;
    	let form;
    	let div;
    	let input;
    	let t6;
    	let button;
    	let t7;
    	let i;
    	let div_class_value;
    	let t8;
    	let t9;
    	let mounted;
    	let dispose;
    	let if_block0 = /*message*/ ctx[2] && create_if_block_1$1(ctx);
    	let if_block1 = /*error*/ ctx[4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			h2 = element("h2");
    			t0 = text("Hello , ");
    			t1 = text(/*name*/ ctx[5]);
    			t2 = space();
    			br = element("br");
    			t3 = space();
    			t4 = text(/*todayDate*/ ctx[6]);
    			t5 = space();
    			form = element("form");
    			div = element("div");
    			input = element("input");
    			t6 = space();
    			button = element("button");
    			t7 = text("Submit\n        ");
    			i = element("i");
    			t8 = space();
    			if (if_block0) if_block0.c();
    			t9 = space();
    			if (if_block1) if_block1.c();
    			add_location(br, file$3, 61, 6, 1633);
    			attr_dev(h2, "class", "svelte-3eja2p");
    			add_location(h2, file$3, 59, 4, 1601);
    			attr_dev(header, "class", "svelte-3eja2p");
    			add_location(header, file$3, 58, 2, 1588);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Write your ideas now !");
    			attr_dev(input, "class", "svelte-3eja2p");
    			add_location(input, file$3, 67, 6, 1781);
    			attr_dev(i, "class", "fa-regular fa-plus icon svelte-3eja2p");
    			add_location(i, file$3, 75, 8, 2012);
    			button.disabled = /*btnDisabled*/ ctx[1];
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-3eja2p");
    			toggle_class(button, "btnDisabled", /*btnDisabled*/ ctx[1]);
    			add_location(button, file$3, 73, 6, 1925);
    			attr_dev(div, "class", div_class_value = "input-group " + /*validateInput*/ ctx[3] + " svelte-3eja2p");
    			add_location(div, file$3, 66, 4, 1733);
    			add_location(form, file$3, 65, 2, 1682);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(h2, t2);
    			append_dev(h2, br);
    			append_dev(h2, t3);
    			append_dev(h2, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, form, anchor);
    			append_dev(form, div);
    			append_dev(div, input);
    			set_input_value(input, /*text*/ ctx[0]);
    			append_dev(div, t6);
    			append_dev(div, button);
    			append_dev(button, t7);
    			append_dev(button, i);
    			append_dev(form, t8);
    			if (if_block0) if_block0.m(form, null);
    			append_dev(form, t9);
    			if (if_block1) if_block1.m(form, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*handleInput*/ ctx[7], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[10]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[8]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 32) set_data_dev(t1, /*name*/ ctx[5]);

    			if (dirty & /*text*/ 1 && input.value !== /*text*/ ctx[0]) {
    				set_input_value(input, /*text*/ ctx[0]);
    			}

    			if (dirty & /*btnDisabled*/ 2) {
    				prop_dev(button, "disabled", /*btnDisabled*/ ctx[1]);
    			}

    			if (dirty & /*btnDisabled*/ 2) {
    				toggle_class(button, "btnDisabled", /*btnDisabled*/ ctx[1]);
    			}

    			if (dirty & /*validateInput*/ 8 && div_class_value !== (div_class_value = "input-group " + /*validateInput*/ ctx[3] + " svelte-3eja2p")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (/*message*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(form, t9);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*error*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(form, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(form);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(58:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, error, message, validateInput, btnDisabled, text, name*/ 8255) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let name;
    	let $SettingsStore;
    	let $TodoListStore;
    	validate_store(SettingsStore, 'SettingsStore');
    	component_subscribe($$self, SettingsStore, $$value => $$invalidate(9, $SettingsStore = $$value));
    	validate_store(TodoListStore, 'TodoListStore');
    	component_subscribe($$self, TodoListStore, $$value => $$invalidate(11, $TodoListStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Form', slots, []);

    	const todayDate = new Date().toLocaleDateString("en-US", {
    		weekday: "long",
    		year: "numeric",
    		month: "long",
    		day: "numeric"
    	});

    	let text = "";
    	let btnDisabled = true;
    	let min = 10;
    	let message;
    	let validateInput = "";
    	let error;

    	const handleInput = () => {
    		if (text.trim().length <= min) {
    			$$invalidate(2, message = `Text must be at least ${min} characters`);
    			$$invalidate(3, validateInput = "wrong-input");
    			$$invalidate(1, btnDisabled = true);
    		} else {
    			$$invalidate(2, message = null);
    			$$invalidate(1, btnDisabled = false);
    			$$invalidate(3, validateInput = "correct-input");
    		}
    	};

    	const handleSubmit = async () => {
    		if (text.trim().length > min) {
    			const newTodo = {
    				task: text,
    				author: $SettingsStore["name"],
    				status: false
    			};

    			try {
    				console.log("before @Form.svelte", $TodoListStore);
    				let newTodoData = (await TodosDataService$1.create(newTodo)).data;

    				TodoListStore.update(currentTodoList => {
    					return [newTodoData, ...currentTodoList];
    				});

    				console.log("after @Form.svelte", $TodoListStore);
    				$$invalidate(0, text = "");
    				$$invalidate(3, validateInput = "");
    				$$invalidate(1, btnDisabled = true);
    			} catch(e) {
    				$$invalidate(4, error = e);
    			}
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Form> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	$$self.$capture_state = () => ({
    		Card,
    		TodosDataService: TodosDataService$1,
    		TodoListStore,
    		SettingsStore,
    		todayDate,
    		text,
    		btnDisabled,
    		min,
    		message,
    		validateInput,
    		error,
    		handleInput,
    		handleSubmit,
    		name,
    		$SettingsStore,
    		$TodoListStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('btnDisabled' in $$props) $$invalidate(1, btnDisabled = $$props.btnDisabled);
    		if ('min' in $$props) min = $$props.min;
    		if ('message' in $$props) $$invalidate(2, message = $$props.message);
    		if ('validateInput' in $$props) $$invalidate(3, validateInput = $$props.validateInput);
    		if ('error' in $$props) $$invalidate(4, error = $$props.error);
    		if ('name' in $$props) $$invalidate(5, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$SettingsStore*/ 512) {
    			$$invalidate(5, name = $SettingsStore["name"] === null
    			? "Your Name"
    			: $SettingsStore["name"].split("#")[0]);
    		}
    	};

    	return [
    		text,
    		btnDisabled,
    		message,
    		validateInput,
    		error,
    		name,
    		todayDate,
    		handleInput,
    		handleSubmit,
    		$SettingsStore,
    		input_input_handler
    	];
    }

    class Form extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Form",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    // Unique ID creation requires a high quality random # generator. In the browser we therefore
    // require the crypto API and do not support built-in fallback to lower quality random number
    // generators (like Math.random()).
    var getRandomValues;
    var rnds8 = new Uint8Array(16);
    function rng() {
      // lazy load so that environments that need to polyfill have a chance to do so
      if (!getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);

        if (!getRandomValues) {
          throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
      }

      return getRandomValues(rnds8);
    }

    var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

    function validate(uuid) {
      return typeof uuid === 'string' && REGEX.test(uuid);
    }

    /**
     * Convert array of 16 byte values to UUID string format of the form:
     * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
     */

    var byteToHex = [];

    for (var i = 0; i < 256; ++i) {
      byteToHex.push((i + 0x100).toString(16).substr(1));
    }

    function stringify(arr) {
      var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Note: Be careful editing this code!  It's been tuned for performance
      // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
      var uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
      // of the following:
      // - One or more input array values don't map to a hex octet (leading to
      // "undefined" in the uuid)
      // - Invalid input values for the RFC `version` or `variant` fields

      if (!validate(uuid)) {
        throw TypeError('Stringified UUID is invalid');
      }

      return uuid;
    }

    function v4(options, buf, offset) {
      options = options || {};
      var rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

      rnds[6] = rnds[6] & 0x0f | 0x40;
      rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

      if (buf) {
        offset = offset || 0;

        for (var i = 0; i < 16; ++i) {
          buf[offset + i] = rnds[i];
        }

        return buf;
      }

      return stringify(rnds);
    }

    /* src/components/settings/Settings.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$2 = "src/components/settings/Settings.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fa-solid fa-gear icon svelte-ldwcn9");
    			add_location(i, file$2, 60, 5, 2369);
    			attr_dev(button, "class", "settings-btn svelte-ldwcn9");
    			add_location(button, file$2, 59, 2, 2310);
    			attr_dev(div, "class", "settings svelte-ldwcn9");
    			add_location(div, file$2, 58, 0, 2285);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*alertSettings*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $SettingsStore;
    	validate_store(SettingsStore, 'SettingsStore');
    	component_subscribe($$self, SettingsStore, $$value => $$invalidate(2, $SettingsStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);

    	let inputs = [
    		{
    			label: "name",
    			type: "text",
    			required: true
    		},
    		{ label: "email", type: "email" },
    		{ label: "Primary Color", type: "color" },
    		{ label: "Secondary Color", type: "color" },
    		{
    			label: "Background Image Link",
    			type: "url"
    		}
    	];

    	const promptOptions = { title: "Settings" };

    	const alertSettings = () => {
    		if (SettingsApi$1.isName() === true && inputs[0].label === "name") {
    			inputs = inputs.splice(1, inputs.length - 1);
    		}

    		dialogs.prompt(inputs, promptOptions).then(settingsInputData => {
    			console.log("before settingsInputDatCa", settingsInputData);
    			console.log("before settingstore", settingsInputData);

    			const newSettings = {
    				name: !SettingsApi$1.isName()
    				? settingsInputData[0] + "#" + v4()
    				: SettingsApi$1.getName(),
    				email: settingsInputData[1] + "",
    				"primary-color": settingsInputData[2] === undefined
    				? "#aaaa"
    				: settingsInputData[2] + "",
    				"secondary-color": settingsInputData[3] === undefined
    				? "#eee"
    				: settingsInputData[3] + "",
    				"background-image": settingsInputData[4] === undefined
    				? $SettingsStore["background-image"]
    				: "url(" + settingsInputData[4] + ")"
    			};

    			console.log("after newSettings", newSettings);

    			if (SettingsApi$1.isName() === true) {
    				SettingsApi$1.setSettings(newSettings);
    			} else {
    				SettingsApi$1.setSettings(newSettings);

    				SettingsStore.update(oldSettings => {
    					return Object.assign(Object.assign({}, oldSettings), newSettings);
    				});
    			}

    			console.log("after @settings.svelte", $SettingsStore["name"]);
    		});
    	};

    	// checking if name is set or not in local storage && running the settings once
    	if (SettingsApi$1.isName() === false) {
    		alertSettings();
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		dialogs,
    		SettingsApi: SettingsApi$1,
    		SettingsStore,
    		uuidv4: v4,
    		inputs,
    		promptOptions,
    		alertSettings,
    		$SettingsStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('inputs' in $$props) inputs = $$props.inputs;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [alertSettings];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/image/Image.svelte generated by Svelte v3.49.0 */
    const file$1 = "src/components/image/Image.svelte";

    // (28:18) 
    function create_if_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "loader svelte-1m49koy");
    			if (!src_url_equal(img.src, img_src_value = "https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Loading...");
    			add_location(img, file$1, 28, 2, 596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(28:18) ",
    		ctx
    	});

    	return block;
    }

    // (23:17) 
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://icon-library.com/images/not-found-icon/not-found-icon-20.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Not Found");
    			add_location(img, file$1, 23, 2, 466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(23:17) ",
    		ctx
    	});

    	return block;
    }

    // (21:0) {#if loaded}
    function create_if_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "logo svelte-1m49koy");
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Document");
    			add_location(img, file$1, 21, 2, 404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*src*/ 1 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(21:0) {#if loaded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*loaded*/ ctx[1]) return create_if_block;
    		if (/*failed*/ ctx[2]) return create_if_block_1;
    		if (/*loading*/ ctx[3]) return create_if_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { src } = $$props;
    	let loaded = false;
    	let failed = false;
    	let loading = false;

    	onMount(() => {
    		const img = new Image();
    		img.src = src;
    		$$invalidate(3, loading = true);

    		img.onload = () => {
    			$$invalidate(3, loading = false);
    			$$invalidate(1, loaded = true);
    		};

    		img.onerror = () => {
    			$$invalidate(3, loading = false);
    			$$invalidate(2, failed = true);
    		};
    	});

    	const writable_props = ['src'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    	};

    	$$self.$capture_state = () => ({ onMount, src, loaded, failed, loading });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('loaded' in $$props) $$invalidate(1, loaded = $$props.loaded);
    		if ('failed' in $$props) $$invalidate(2, failed = $$props.failed);
    		if ('loading' in $$props) $$invalidate(3, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, loaded, failed, loading];
    }

    class Image_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { src: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image_1",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !('src' in props)) {
    			console.warn("<Image> was created without expected prop 'src'");
    		}
    	}

    	get src() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.49.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let image;
    	let t0;
    	let settings;
    	let t1;
    	let form;
    	let t2;
    	let todolist;
    	let t3;
    	let footer;
    	let current;

    	image = new Image_1({
    			props: { src: "assets/logo.png" },
    			$$inline: true
    		});

    	settings = new Settings({ $$inline: true });
    	form = new Form({ $$inline: true });
    	todolist = new TodoList({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(image.$$.fragment);
    			t0 = space();
    			create_component(settings.$$.fragment);
    			t1 = space();
    			create_component(form.$$.fragment);
    			t2 = space();
    			create_component(todolist.$$.fragment);
    			t3 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(div0, "class", "center svelte-1pads0y");
    			add_location(div0, file, 23, 6, 994);
    			attr_dev(div1, "class", "body svelte-1pads0y");
    			add_location(div1, file, 22, 4, 969);
    			attr_dev(div2, "class", "container p-5");
    			add_location(div2, file, 21, 2, 937);
    			attr_dev(div3, "class", "fluid-container all svelte-1pads0y");
    			add_location(div3, file, 20, 0, 877);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(image, div0, null);
    			append_dev(div1, t0);
    			mount_component(settings, div1, null);
    			append_dev(div1, t1);
    			mount_component(form, div1, null);
    			append_dev(div1, t2);
    			mount_component(todolist, div1, null);
    			append_dev(div3, t3);
    			mount_component(footer, div3, null);
    			/*div3_binding*/ ctx[2](div3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			transition_in(settings.$$.fragment, local);
    			transition_in(form.$$.fragment, local);
    			transition_in(todolist.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			transition_out(settings.$$.fragment, local);
    			transition_out(form.$$.fragment, local);
    			transition_out(todolist.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(image);
    			destroy_component(settings);
    			destroy_component(form);
    			destroy_component(todolist);
    			destroy_component(footer);
    			/*div3_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $SettingsStore;
    	validate_store(SettingsStore, 'SettingsStore');
    	component_subscribe($$self, SettingsStore, $$value => $$invalidate(1, $SettingsStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(async function () {
    		set_store_value(SettingsStore, $SettingsStore = await SettingsApi$1.getSettings(), $SettingsStore);
    	});

    	let rootElement;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			rootElement = $$value;
    			$$invalidate(0, rootElement);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Footer,
    		TodoList,
    		Form,
    		Settings,
    		SettingsApi: SettingsApi$1,
    		onMount,
    		SettingsStore,
    		Image: Image_1,
    		rootElement,
    		$SettingsStore
    	});

    	$$self.$inject_state = $$props => {
    		if ('rootElement' in $$props) $$invalidate(0, rootElement = $$props.rootElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*rootElement, $SettingsStore*/ 3) {
    			rootElement && rootElement.style.setProperty("--primary-color", $SettingsStore["primary-color"]);
    		}

    		if ($$self.$$.dirty & /*rootElement, $SettingsStore*/ 3) {
    			rootElement && rootElement.style.setProperty("--secondary-color", $SettingsStore["secondary-color"]);
    		}

    		if ($$self.$$.dirty & /*rootElement, $SettingsStore*/ 3) {
    			rootElement && rootElement.style.setProperty("--background-image", $SettingsStore["background-image"]);
    		}
    	};

    	return [rootElement, $SettingsStore, div3_binding];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
