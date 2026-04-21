# Rollback runbook

Three-tier promotion flow on this repo:

```
feature branch  →  develop  →  main
    (ad-hoc)       (qa.help.*)  (servantium.com)
```

Every Cloudflare deploy is preserved. Rollback options, fastest first.

## Level 1: bad commit on a feature branch

Just force-push over it.

```bash
git reset --hard HEAD~1
git push --force-with-lease
```

Cloudflare rebuilds the preview URL in ~2 min.

## Level 2: bad state on develop (breaks test.servantium.com)

Reset develop back to main.

```bash
git checkout develop
git reset --hard origin/main
git push --force-with-lease
```

## Level 3: bad state on main (breaks servantium.com)

Revert the merge commit.

```bash
git checkout main
git revert -m 1 <merge-sha>        # find via `git log --oneline -5`
git push
```

Cloudflare redeploys main in ~2 min.

## Level 4: can't wait for rebuild — rollback at Cloudflare edge

Cloudflare Pages dashboard → servantium-website → Deployments → find last known good production deploy → **Rollback to this deployment**. Takes ~10 seconds, serves instantly.

Do this if you need servantium.com back in <1 minute. Then fix the git state in parallel.

## Design-system rollback

If the design system is the source of the problem (bad Grove component, broken Verdant token), roll back the pin instead of the site:

```bash
# Edit .design-system-ref to previous good version
echo "v0.1.4" > .design-system-ref   # or whatever SHA/tag was good
git commit -am "revert: pin design-system to v0.1.4"
git push
```

Site rebuilds against the older design-system version. Site content unchanged.

## Rolling back design-system itself

Design-system tags are permanent. You don't delete them. You just pin consumers to an older one.

If a tag was published with bugs, the safest move is to cut a new patch tag that reverses the change, bump consumers' `.design-system-ref` to the new patch tag.
