import glossaryTerms from '@/content/glossary/terms.json'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

export function GlossaryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">术语表</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Badge>双层解释</Badge>
            <h2 className="text-2xl font-semibold text-slate-900">站内术语表</h2>
            <p className="text-sm text-slate-500">
              每个术语同时提供普通用户解释和进阶用户解释，帮助不同背景的人都能读懂。
            </p>
          </div>
          <div className="grid gap-3">
            {glossaryTerms.map((term) => (
              <Card key={term.id} className="space-y-2 p-4">
                <h3 className="text-lg font-semibold text-slate-900">{term.term}</h3>
                <p className="text-sm text-slate-600">{term.simple}</p>
                <p className="text-sm text-slate-500">{term.advanced}</p>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
